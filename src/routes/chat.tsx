import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, AlertTriangle } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Ask Maatri — AI pregnancy assistant" }] }),
  component: ChatPage,
});

function ChatPage() {
  const { tr, lang } = useLang();
  const { phase, profile, setPhase } = useAppState();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: () => ({ language: lang, phase, profile }),
    }),
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const submit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput("");
    // Auto-transition to postpartum when user announces birth
    if (/baby (is )?born|delivery (is )?(done|complete)|बच्चा जन्म|प्रसव/i.test(trimmed)) {
      setPhase("postpartum");
    }
    await sendMessage({ text: trimmed });
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const suggestions =
    lang === "ne"
      ? ["२० हप्तामा कस्तो पोषण लिनु पर्छ?", "हल्का व्यायाम केही सिफारिस गर्नुहोस्", "कुन लक्षण खतरनाक हुन्?"]
      : ["What should I eat in week 20?", "Suggest some gentle exercises", "Which symptoms are danger signs?"];

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <main className="bg-warm-gradient min-h-[calc(100svh-65px)] px-4 py-6 sm:px-6">
      <div className="mx-auto flex h-[calc(100svh-110px)] max-w-3xl flex-col">
        <div className="mb-3 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blush text-primary">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-xl font-semibold">{tr("askMaatri")}</h1>
            <p className="text-xs text-muted-foreground">
              {lang === "ne"
                ? "म डाक्टरको विकल्प होइन — गम्भीर अवस्थामा चिकित्सक भेट्नुहोस्।"
                : "I'm not a replacement for a doctor — please consult one for serious concerns."}
            </p>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="glass-card flex-1 overflow-y-auto rounded-3xl p-5"
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-blush text-primary">
                <Sparkles className="h-8 w-8" />
              </div>
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                {lang === "ne"
                  ? "नमस्ते! म माatरी हुँ। गर्भावस्था, पोषण वा लक्षणको बारेमा जे पनि सोध्नुहोस्।"
                  : "Hi! I'm Maatri. Ask me anything about pregnancy, nutrition, or symptoms."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="rounded-full border border-border bg-card px-4 py-2 text-xs text-foreground transition hover:bg-blush hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((m) => {
                const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
                const isUser = m.role === "user";
                return (
                  <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    {isUser ? (
                      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-soft">
                        {text}
                      </div>
                    ) : (
                      <div className="max-w-[85%] whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                        {text || (
                          <span className="inline-flex gap-1 text-muted-foreground">
                            <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <span className="inline-flex gap-1 text-muted-foreground">
                    <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-xs text-destructive">
            <AlertTriangle className="h-4 w-4" />
            {lang === "ne" ? "केहि गडबड भयो। फेरि कोसिस गर्नुहोस्।" : "Something went wrong. Please try again."}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="mt-3 flex items-end gap-2 rounded-3xl border border-border bg-card p-2 shadow-soft"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(input);
              }
            }}
            rows={1}
            placeholder={tr("chatPlaceholder")}
            className="max-h-32 min-h-[44px] flex-1 resize-none rounded-2xl bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground transition disabled:opacity-40"
            aria-label={tr("send")}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </main>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="inline-block h-2 w-2 animate-bounce rounded-full bg-primary/60"
      style={{ animationDelay: delay }}
    />
  );
}