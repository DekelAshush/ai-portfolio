"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { SUGGESTED_FAQ_QUESTIONS } from "@/data/presetFaq";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);

  /** Keep the latest question, typing state, and answer in view. */
  useLayoutEffect(() => {
    if (!isOpen) return;
    const el = messagesScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [isOpen, messages, isTyping]);

  const sendMessage = async (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || isTyping) return;
    setRequestError(null);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : `Request failed (${res.status})`;
        setRequestError(err);
        return;
      }
      if (
        typeof data !== "object" ||
        data === null ||
        !("reply" in data) ||
        typeof (data as { reply: unknown }).reply !== "string"
      ) {
        setRequestError("Unexpected response from the server.");
        return;
      }
      const reply = (data as { reply: string }).reply;
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setRequestError("Network error. Check your connection and try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    void sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Sticky floating button */}
      <button
        suppressHydrationWarning
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-emerald-500/40 bg-zinc-900/95 px-5 py-3 text-sm font-medium text-emerald-400 shadow-lg shadow-black/30 backdrop-blur-md transition-all hover:border-emerald-500/70 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)]"
        aria-label="Ask my AI"
      >
        <MessageCircle className="h-5 w-5" />
        Ask my AI
      </button>

      {/* Drawer overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

      {/* Drawer panel */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
              <MessageCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-50">Ask my AI</h3>
              <p className="text-xs text-zinc-500">
                Questions about my experience & projects
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={messagesScrollRef}
          className="flex-1 overflow-y-auto p-5"
        >
          {messages.length === 0 && !isTyping ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="rounded-full border border-zinc-700/50 bg-zinc-800/30 p-4">
                <MessageCircle className="h-10 w-10 text-zinc-500" />
              </div>
              <div>
                <p className="text-zinc-400">
                  Ask me anything about my experience, projects, or tech stack.
                </p>
                <p className="mt-1 text-sm text-zinc-500">Or try one of these:</p>
                <div className="mt-3 flex w-full max-w-sm flex-col gap-2">
                  {SUGGESTED_FAQ_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        void sendMessage(q);
                      }}
                      disabled={isTyping}
                      className="rounded-lg border border-zinc-700/80 bg-zinc-800/40 px-3 py-2 text-left text-xs text-zinc-300 transition-colors hover:border-emerald-500/30 hover:bg-zinc-800/70 disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      msg.role === "user"
                        ? "bg-emerald-500/20 text-emerald-100"
                        : "bg-zinc-800/80 text-zinc-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-zinc-800/80 px-4 py-2.5">
                    <span className="inline-flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-zinc-800 p-4">
          {requestError && (
            <p className="mb-3 text-xs text-rose-400" role="alert">
              {requestError}
            </p>
          )}
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about my experience..."
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-50 placeholder:text-zinc-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              disabled={isTyping}
              suppressHydrationWarning
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="rounded-xl bg-emerald-500/20 px-4 py-3 text-emerald-400 transition-colors hover:bg-emerald-500/30 disabled:opacity-50 disabled:hover:bg-emerald-500/20"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
