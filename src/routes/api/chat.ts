import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

type Body = {
  messages?: UIMessage[];
  languageName?: string;
  level?: string;
  mode?: "tutor" | "scenario";
  scenarioBrief?: string;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as Body;
        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("AI is not configured", { status: 500 });

        const language = body.languageName ?? "French";
        const level = body.level ?? "Beginner";

        const system =
          body.mode === "scenario"
            ? [
                `You are role-playing a real-life scene entirely in ${language} with an English-speaking ${level} learner.`,
                `Scene: ${body.scenarioBrief ?? "a casual conversation"}`,
                `Stay in character. Reply in ${language} first (short, natural, 1-3 sentences), then on a new line give an italic English translation.`,
                `If the learner makes a mistake, add a short "💡 Tip:" line correcting it gently and suggesting a better phrasing.`,
                `Match vocabulary to the ${level} level. Never break character to lecture.`,
              ].join("\n")
            : [
                `You are NISQAI, an expert ${language} tutor for an English-speaking ${level} learner.`,
                `Reply in ${language} first, then give the English translation in italics.`,
                `Always correct grammar mistakes explicitly under a "✅ Correction" heading and suggest a more natural sentence under "✨ Better".`,
                `Keep answers short, warm and encouraging. Use markdown. Ask a follow-up question to keep the conversation going.`,
              ].join("\n");

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("openai/gpt-5.5"),
          system,
          messages: await convertToModelMessages(body.messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: body.messages });
      },
    },
  },
});