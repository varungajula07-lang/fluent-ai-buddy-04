import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ChatPanel({
  chatId,
  languageName,
  level,
  mode,
  scenarioBrief,
  starter,
}: {
  chatId: string;
  languageName: string;
  level: string;
  mode: "tutor" | "scenario";
  scenarioBrief?: string;
  starter: string;
}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status } = useChat({
    id: chatId,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { languageName, level, mode, scenarioBrief },
    }),
    onError: (error) =>
      toast.error(
        error.message.includes("429")
          ? "Too many requests — give it a few seconds."
          : "The tutor could not answer. Please try again.",
      ),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [chatId, busy]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    void sendMessage({ text });
  }

  return (
    <div className="flex h-[calc(100dvh-14rem)] flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {messages.length === 0 && (
          <p className="card-soft p-4 text-sm text-muted-foreground">{starter}</p>
        )}
        {messages.map((message) => {
          const text = message.parts
            .map((part) => (part.type === "text" ? part.text : ""))
            .join("");
          const isUser = message.role === "user";
          return (
            <div key={message.id} className={isUser ? "flex justify-end" : ""}>
              <div
                className={
                  isUser
                    ? "max-w-[80%] rounded-3xl rounded-br-md bg-primary px-4 py-2.5 font-semibold text-primary-foreground"
                    : "max-w-[92%] whitespace-pre-wrap text-[0.95rem] leading-relaxed text-foreground"
                }
              >
                {text}
              </div>
            </div>
          );
        })}
        {status === "submitted" && (
          <p className="animate-pulse text-sm font-bold text-muted-foreground">Thinking…</p>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={submit} className="mt-3 flex items-end gap-2">
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) submit(e);
          }}
          placeholder={`Write in ${languageName} or English…`}
          className="card-soft max-h-32 min-h-12 flex-1 resize-none px-4 py-3 text-base outline-none focus:border-accent"
        />
        <Button
          type="submit"
          disabled={busy}
          size="icon"
          className="chunk h-12 w-12 shrink-0 rounded-2xl"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}