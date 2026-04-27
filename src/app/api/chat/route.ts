import { NextResponse } from "next/server";
import { runRagChat, MAX_USER_LEN } from "@/lib/rag/runRagChat";

export const maxDuration = 60;

export async function POST(req: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json(
      {
        error:
          "Chat is not configured: set OPENAI_API_KEY on the server (e.g. in .env.local).",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message =
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof (body as { message: unknown }).message === "string"
      ? (body as { message: string }).message
      : null;

  if (message === null) {
    return NextResponse.json(
      { error: 'Expected JSON: { "message": string }' },
      { status: 400 },
    );
  }

  if (message.length > MAX_USER_LEN) {
    return NextResponse.json(
      { error: `Message too long (max ${MAX_USER_LEN} characters).` },
      { status: 400 },
    );
  }

  try {
    const reply = await runRagChat(message, { apiKey: key });
    return NextResponse.json({ reply });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Chat request failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
