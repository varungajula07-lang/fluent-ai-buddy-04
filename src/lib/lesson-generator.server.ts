import { generateText, NoObjectGeneratedError, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider, requireLovableApiKey } from "./ai-gateway.server";
import type { LessonContent } from "./nisqai";

const lessonSchema = z.object({
  words: z.array(
    z.object({
      term: z.string(),
      translation: z.string(),
      pronunciation: z.string(),
    }),
  ),
  sentences: z.array(z.object({ text: z.string(), translation: z.string() })),
  dialogue: z.object({
    title: z.string(),
    lines: z.array(
      z.object({ speaker: z.string(), text: z.string(), translation: z.string() }),
    ),
  }),
  quiz: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
      answerIndex: z.number(),
      explanation: z.string(),
    }),
  ),
});

export async function buildLesson(input: {
  languageCode: string;
  languageName: string;
  level: string;
  topic: string;
}): Promise<LessonContent> {
  const gateway = createLovableAiGatewayProvider(requireLovableApiKey(), {
    structuredOutputs: true,
  });

  const prompt = [
    `You are an expert ${input.languageName} tutor building one lesson for an English speaker.`,
    `Level: ${input.level}. Topic: "${input.topic}".`,
    `Produce exactly 10 vocabulary words, exactly 5 example sentences, one real-life dialogue with 6 to 8 lines, and exactly 5 multiple-choice quiz questions.`,
    `Every quiz question must have exactly 4 options and answerIndex must be the 0-based index of the correct option.`,
    `"term", "text" and dialogue "text" are in ${input.languageName}; "translation" is English.`,
    `"pronunciation" is a simple English-friendly phonetic hint.`,
    `Adjust difficulty to the ${input.level} level. Keep everything natural and useful in real life.`,
  ].join("\n");

  try {
    const { output } = await generateText({
      model: gateway("openai/gpt-5.5"),
      output: Output.object({ schema: lessonSchema }),
      prompt,
    });
    return normalize(output, input.topic);
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error) && error.text) {
      try {
        const parsed = lessonSchema.parse(JSON.parse(error.text));
        return normalize(parsed, input.topic);
      } catch {
        /* fall through */
      }
    }
    throw error;
  }
}

function normalize(raw: z.infer<typeof lessonSchema>, topic: string): LessonContent {
  return {
    topic,
    words: raw.words.slice(0, 10),
    sentences: raw.sentences.slice(0, 5),
    dialogue: { title: raw.dialogue.title, lines: raw.dialogue.lines.slice(0, 10) },
    quiz: raw.quiz
      .slice(0, 5)
      .filter((q) => q.options.length >= 2)
      .map((q) => ({
        ...q,
        options: q.options.slice(0, 4),
        answerIndex: Math.min(Math.max(q.answerIndex, 0), Math.min(q.options.length, 4) - 1),
      })),
  };
}