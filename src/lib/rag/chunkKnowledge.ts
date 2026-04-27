const MAX = 800;
const OVERLAP = 100;

/**
 * Splits `knowledge.md` by `##` headings, then sub-splits long bodies with overlap.
 */
export function chunkKnowledgeMarkdown(
  fullText: string,
  sourceBase = "knowledge",
): { source: string; text: string }[] {
  const normalized = fullText.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const parts = normalized.split(/(?=^## )/m).map((p) => p.trim()).filter(Boolean);
  const out: { source: string; text: string }[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const headingLine = part.split("\n")[0] ?? "";
    const label = headingLine.replace(/^##\s*/, "").trim() || `section-${i}`;
    const slug = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const source = `${sourceBase}:${slug || i}`;

    if (part.length <= MAX) {
      out.push({ source, text: part });
      continue;
    }

    for (let start = 0; start < part.length; start += MAX - OVERLAP) {
      const slice = part.slice(start, start + MAX);
      if (slice.trim()) {
        out.push({ source, text: slice.trim() });
      }
    }
  }

  return out;
}
