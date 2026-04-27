import { readFile } from "fs/promises";
import { join } from "path";
import OpenAI from "openai";
import { projects } from "@/data/projects";
import { PRESET_FAQ, type PresetFaqItem } from "@/data/presetFaq";
import { formatProjectsForRag } from "@/lib/rag/formatProjectsForRag";
import { chunkKnowledgeMarkdown } from "@/lib/rag/chunkKnowledge";
import { cosineSimilarity } from "@/lib/rag/vector";

const EMBED_MODEL = "text-embedding-3-small";
const CHAT_MODEL = "gpt-4o-mini";
/** Lower than 0.84 so near-duplicate FAQ questions still match; aliases are embedded separately too. */
const FAQ_MATCH_MIN = 0.78;
const TOP_K = 5;
const MAX_USER_LEN = 2000;

type ChunkRow = { source: string; text: string };

type RagIndex = {
  faq: { item: PresetFaqItem; keyText: string; vector: number[] }[];
  chunks: { source: string; text: string; vector: number[] }[];
};

let indexPromise: Promise<RagIndex> | null = null;

function buildFaqKeyText(f: PresetFaqItem): string {
  const tail = f.aliases?.length ? f.aliases.join(" ") : "";
  return `${f.question} ${tail}`.trim();
}

/** Normalize curly quotes so user input matches FAQ strings embedded with ASCII quotes. */
function normalizeUserQuery(s: string): string {
  return s
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
    .trim();
}

/** One embedding vector per string; same FAQ id may appear on multiple rows for better recall. */
function uniqueFaqKeyStrings(item: PresetFaqItem): string[] {
  const combined = buildFaqKeyText(item);
  const raw = [
    item.question.trim(),
    combined,
    ...(item.aliases ?? []).map((a) => a.trim()),
  ].filter(Boolean);
  return [...new Set(raw)];
}

async function readKnowledgeFile(): Promise<string> {
  const path = join(process.cwd(), "content", "knowledge.md");
  try {
    return await readFile(path, "utf-8");
  } catch {
    return "";
  }
}

async function readResumeFile(): Promise<string> {
  const path = join(process.cwd(), "content", "resume.md");
  try {
    return await readFile(path, "utf-8");
  } catch {
    return "";
  }
}

function buildChunkRows(knowledgeMd: string, resumeMd: string): ChunkRow[] {
  const fromKnowledge = chunkKnowledgeMarkdown(knowledgeMd, "knowledge");
  const fromResume = chunkKnowledgeMarkdown(resumeMd, "resume");
  const fromProjects = formatProjectsForRag(projects).map((text, i) => ({
    source: `project:${projects[i]?.title ?? i}`,
    text,
  }));
  return [...fromKnowledge, ...fromResume, ...fromProjects];
}

async function buildIndex(client: OpenAI): Promise<RagIndex> {
  const [knowledgeMd, resumeMd] = await Promise.all([
    readKnowledgeFile(),
    readResumeFile(),
  ]);
  const chunkRows = buildChunkRows(knowledgeMd, resumeMd);
  const faqRows = PRESET_FAQ.flatMap((item) =>
    uniqueFaqKeyStrings(item).map((keyText) => ({ item, keyText })),
  );

  const allInputs: string[] = [
    ...faqRows.map((r) => r.keyText),
    ...chunkRows.map((c) => c.text),
  ];

  if (allInputs.length === 0) {
    return { faq: [], chunks: [] };
  }

  const emb = await client.embeddings.create({
    model: EMBED_MODEL,
    input: allInputs,
  });
  const vectors = emb.data
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);

  const faq: RagIndex["faq"] = faqRows.map((r, i) => ({
    item: r.item,
    keyText: r.keyText,
    vector: vectors[i]!,
  }));
  const off = faqRows.length;
  const chunks: RagIndex["chunks"] = chunkRows.map((c, j) => ({
    source: c.source,
    text: c.text,
    vector: vectors[off + j]!,
  }));
  return { faq, chunks };
}

function getIndex(client: OpenAI): Promise<RagIndex> {
  if (!indexPromise) {
    indexPromise = buildIndex(client);
  }
  return indexPromise;
}

function bestFaq(
  userVec: number[],
  faq: RagIndex["faq"],
): { item: PresetFaqItem; score: number } | null {
  if (faq.length === 0) return null;
  const bestById = new Map<string, { item: PresetFaqItem; score: number }>();
  for (const row of faq) {
    const score = cosineSimilarity(userVec, row.vector);
    const id = row.item.id;
    const prev = bestById.get(id);
    if (!prev || score > prev.score) {
      bestById.set(id, { item: row.item, score });
    }
  }
  let best: { item: PresetFaqItem; score: number } | null = null;
  for (const v of bestById.values()) {
    if (!best || v.score > best.score) {
      best = v;
    }
  }
  return best;
}

function topKChunks(
  userVec: number[],
  chunks: RagIndex["chunks"],
  k: number,
): { source: string; text: string }[] {
  if (chunks.length === 0) return [];
  const scored = chunks
    .map((c) => ({
      source: c.source,
      text: c.text,
      score: cosineSimilarity(userVec, c.vector),
    }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

const SYSTEM = `You are a concise, friendly portfolio assistant for Dekel Ashush, a software developer. Answer using the CONTEXT block when it supports an answer. The context may include a résumé (sources "resume:"), site narrative ("knowledge:"), and project summaries ("project:"). Knowledge chunks may explain how portfolio demos relate to live project sites, hosting limits, and API costs—use them when relevant. If the answer is truly not supported by the context, say clearly that the portfolio material does not include that detail. Do not invent employers, dates, or projects. Keep answers to a few short paragraphs at most. Do not give medical, legal, or immigration advice.`;

export async function runRagChat(
  userMessage: string,
  options: { apiKey: string },
): Promise<string> {
  const trimmed = normalizeUserQuery(userMessage).slice(0, MAX_USER_LEN).trim();
  if (!trimmed) {
    return "Please ask a question in a few words or more.";
  }

  const client = new OpenAI({ apiKey: options.apiKey });
  const index = await getIndex(client);

  const uEmb = await client.embeddings.create({
    model: EMBED_MODEL,
    input: trimmed,
  });
  const userVec = uEmb.data[0]?.embedding;
  if (!userVec) {
    return "Could not process your message. Please try again.";
  }

  const faqHit = bestFaq(userVec, index.faq);
  if (faqHit && faqHit.score >= FAQ_MATCH_MIN) {
    return faqHit.item.answer;
  }

  const top = topKChunks(userVec, index.chunks, TOP_K);
  const contextText =
    top.length > 0
      ? top
          .map(
            (c, i) =>
              `[${i + 1} source: ${c.source}]\n${c.text}`,
          )
          .join("\n\n---\n\n")
      : "(No context chunks were indexed.)";

  const res = await client.chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0.4,
    max_tokens: 800,
    messages: [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: `CONTEXT:\n${contextText}\n\nUSER QUESTION:\n${trimmed}`,
      },
    ],
  });
  const text = res.choices[0]?.message?.content?.trim();
  return text || "I could not generate a response. Please try again.";
}

export { MAX_USER_LEN };
