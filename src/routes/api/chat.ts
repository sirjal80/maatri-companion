import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider, createOpenAiGatewayProvider } from "@/lib/ai-gateway.server";

type Body = {
  messages?: unknown;
  language?: "ne" | "en";
  phase?: "pregnancy" | "postpartum";
  profile?: Record<string, unknown> | null;
  openAIApiKey?: string;
};

function systemPrompt(language: "ne" | "en", phase: "pregnancy" | "postpartum", profile: Record<string, unknown> | null) {
  const lang = language === "ne" ? "Nepali (नेपाली)" : "English";
  const phaseLabel =
    phase === "postpartum"
      ? "the mother is in the POSTPARTUM phase (baby is born)"
      : "the mother is in the PREGNANCY phase";
  const profileText = profile && Object.keys(profile).length > 0
    ? `Mother profile: ${JSON.stringify(profile)}.`
    : "No profile provided — keep guidance general.";

  return [
    "You are Maatri, a warm, calm, friendly AI companion for mothers in Nepal.",
    `Always reply in ${lang}. Keep tone gentle, supportive, never clinical or alarming.`,
    `Context: ${phaseLabel}. ${profileText}`,
    "Cover: pregnancy/postpartum questions, nutrition, gentle exercise, symptoms, breastfeeding, newborn care, emotional support.",
    "Use short paragraphs and simple words. When you give a tip, format it as a small bullet list.",
    "SAFETY: If the user mentions heavy bleeding, severe pain, no fetal movement, high fever, fainting, or any danger sign — tell them clearly to seek immediate medical care or call emergency services, and suggest the in-app Emergency button. Always add a brief disclaimer that you are not a replacement for a doctor when health-specific questions come up.",
    "If the user says their baby is born / delivery is done — congratulate them warmly and tell them you have switched to postpartum mode.",
  ].join("\n");
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as Body;
        if (!Array.isArray(body.messages)) {
          return new Response("messages required", { status: 400 });
        }
        const key =
          body.openAIApiKey?.trim() ||
          process.env.OPENAI_API_KEY?.trim() ||
          process.env.VITE_OPENAI_API_KEY?.trim() ||
          process.env.LOVABLE_API_KEY?.trim();
        if (!key) {
          return new Response(
            "Missing API key: set OPENAI_API_KEY or LOVABLE_API_KEY on the server",
            { status: 500 },
          );
        }

        const useOpenAI = Boolean(
          body.openAIApiKey?.trim() ||
          process.env.OPENAI_API_KEY?.trim() ||
          process.env.VITE_OPENAI_API_KEY?.trim(),
        );
        const gateway = useOpenAI
          ? createOpenAiGatewayProvider(key)
          : createLovableAiGatewayProvider(key);
        const model = useOpenAI
          ? gateway("gpt-3.5-turbo")
          : gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: systemPrompt(body.language ?? "en", body.phase ?? "pregnancy", body.profile ?? null),
          messages: await convertToModelMessages(body.messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: body.messages as UIMessage[],
        });
      },
    },
  },
});