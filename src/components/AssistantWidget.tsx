"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { BotReply, genId, matchQuestion, randomTypingDelay, suggestions } from "@/lib/chatbot";

type Message = {
  id: string;
  role: "bot" | "user";
  reply?: BotReply;
  text?: string;
};

const GREETING: Message = {
  id: "greeting",
  role: "bot",
  reply: {
    text: "Chào anh/chị! Em là trợ lý TJShip, anh/chị có thể chọn câu hỏi gợi ý bên dưới hoặc gõ câu hỏi về đơn hàng, tài xế hôm nay.",
  },
};

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function ask(label: string, reply: BotReply) {
    const userMsg: Message = { id: genId(), role: "user", text: label };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: genId(), role: "bot", reply }]);
    }, randomTypingDelay());
  }

  function handleSuggestion(id: string) {
    const s = suggestions.find((x) => x.id === id);
    if (!s) return;
    ask(s.label, s.run());
  }

  function handleSend() {
    const q = input.trim();
    if (!q) return;
    setInput("");
    ask(q, matchQuestion(q));
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 right-4 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-[0_8px_24px_-6px_rgba(255,122,26,0.6)] transition-transform hover:scale-105 md:bottom-6 md:right-6"
        aria-label="Trợ lý TJShip"
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>

      {open && (
        <div className="fixed inset-x-4 bottom-40 z-40 flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-96 md:bottom-24">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/15 text-brand">
              <Bot size={15} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Trợ lý TJShip</p>
              <p className="text-[11px] text-muted">Hỏi nhanh về đơn hàng & tài xế</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                {m.role === "user" ? (
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-brand px-3 py-2 text-sm text-brand-foreground">
                    {m.text}
                  </div>
                ) : (
                  <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-surface-2 px-3 py-2 text-sm text-foreground/90">
                    <p>{m.reply?.text}</p>
                    {m.reply?.list && (
                      <ul className="mt-2 space-y-1 border-t border-border pt-2">
                        {m.reply.list.map((item, i) => (
                          <li key={i} className="text-xs text-foreground/80">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-surface-2 px-3 py-2.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSuggestion(s.id)}
                  disabled={typing}
                  className="flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] text-foreground/80 hover:border-brand/40 hover:text-foreground disabled:opacity-50"
                >
                  <Sparkles size={10} className="text-brand" />
                  {s.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Nhập câu hỏi..."
                className="min-w-0 flex-1 rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
              />
              <button
                onClick={handleSend}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground hover:opacity-90"
                aria-label="Gửi"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
