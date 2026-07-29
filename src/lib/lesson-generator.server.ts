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
    lines: z.array(z.object({ speaker: z.string(), text: z.string(), translation: z.string() })),
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

function buildFallbackLesson(input: {
  languageCode: string;
  languageName: string;
  level: string;
  topic: string;
}): LessonContent {
  const topicLower = input.topic.toLowerCase();
  const wordBank =
    topicLower.includes("greet") || topicLower.includes("introdu")
      ? [
          ["Hello", "Hello", "heh-LOW"],
          ["Nice to meet you", "Nice to meet you", "nice to meet you"],
          ["How are you?", "How are you?", "how are you"],
          ["My name is", "My name is", "my name is"],
          ["Please", "Please", "pleez"],
          ["Thank you", "Thank you", "thank you"],
          ["Welcome", "Welcome", "WEL-kum"],
          ["Friend", "Friend", "frend"],
          ["Together", "Together", "tuh-GETH-er"],
          ["Tomorrow", "Tomorrow", "tuh-MOR-row"],
        ]
      : topicLower.includes("food") || topicLower.includes("drink")
        ? [
            ["Bread", "Bread", "bred"],
            ["Water", "Water", "wah-ter"],
            ["Tea", "Tea", "tee"],
            ["Meal", "Meal", "meel"],
            ["Hungry", "Hungry", "HUN-gree"],
            ["Delicious", "Delicious", "dee-LISH-us"],
            ["Restaurant", "Restaurant", "RES-tuh-rant"],
            ["Menu", "Menu", "MAY-noo"],
            ["Order", "Order", "OR-der"],
            ["Enjoy", "Enjoy", "en-JOY"],
          ]
        : topicLower.includes("travel") ||
            topicLower.includes("airport") ||
            topicLower.includes("town")
          ? [
              ["Train", "Train", "trayn"],
              ["Ticket", "Ticket", "TIK-it"],
              ["Station", "Station", "STAY-shun"],
              ["Hotel", "Hotel", "hoh-TEL"],
              ["Gate", "Gate", "gayt"],
              ["Map", "Map", "map"],
              ["Direction", "Direction", "dee-REK-shun"],
              ["Street", "Street", "street"],
              ["Bus", "Bus", "bus"],
              ["Nearby", "Nearby", "NEAR-by"],
            ]
          : [
              ["Learn", "Learn", "lern"],
              ["Practice", "Practice", "prak-tis"],
              ["Speak", "Speak", "speek"],
              ["Listen", "Listen", "LIS-un"],
              ["Understand", "Understand", "un-der-STAND"],
              ["Question", "Question", "KWES-chun"],
              ["Answer", "Answer", "AN-ser"],
              ["Simple", "Simple", "SIM-puhl"],
              ["Useful", "Useful", "YOO-sful"],
              ["Confident", "Confident", "KON-fi-dent"],
            ];

  const words = wordBank.slice(0, 10).map(([term, translation, pronunciation]) => ({
    term,
    translation,
    pronunciation,
  }));

  const sentences = [
    { text: `${words[0].term}!`, translation: `This means ${words[0].translation}.` },
    { text: `${words[1].term} ${words[2].term}?`, translation: `This is a friendly way to ask. ` },
    { text: `I would like ${words[3].term}.`, translation: `A practical request you can use.` },
    { text: `Can you help me with ${words[4].term}?`, translation: `A useful phrase for support.` },
    { text: `That is ${words[5].term}.`, translation: `This expresses approval.` },
  ];

  return {
    topic: input.topic,
    words,
    sentences,
    dialogue: {
      title: `A practical ${input.topic.toLowerCase()} conversation`,
      lines: [
        { speaker: "A", text: `${words[0].term}!`, translation: `Hello.` },
        { speaker: "B", text: `${words[1].term}.`, translation: `Nice to meet you.` },
        { speaker: "A", text: `How are you today?`, translation: `How are you today?` },
        {
          speaker: "B",
          text: `I am doing well, thank you.`,
          translation: `I am doing well, thank you.`,
        },
        {
          speaker: "A",
          text: `Can you help me with this?`,
          translation: `Can you help me with this?`,
        },
        { speaker: "B", text: `Of course, I can help.`, translation: `Of course, I can help.` },
      ],
    },
    quiz: [
      {
        question: `Which phrase is a polite greeting?`,
        options: ["Please", "Hello", "Tomorrow", "Yellow"],
        answerIndex: 1,
        explanation: "Hello is a friendly everyday greeting.",
      },
      {
        question: `Which word is useful for a request?`,
        options: ["Please", "Map", "Train", "Bus"],
        answerIndex: 0,
        explanation: "Please makes a request polite.",
      },
      {
        question: `What is a helpful everyday action?`,
        options: ["Learn", "Window", "Cloud", "Moon"],
        answerIndex: 0,
        explanation: "Learning and practicing builds confidence.",
      },
      {
        question: `Which answer fits a simple response?`,
        options: ["Thank you", "Stone", "River", "Sky"],
        answerIndex: 0,
        explanation: "Thank you is a common polite response.",
      },
      {
        question: `Which choice is useful in conversation?`,
        options: ["Friend", "Chair", "Mirror", "Spoon"],
        answerIndex: 0,
        explanation: "Friend is a useful word for everyday conversation.",
      },
    ],
  };
}

export async function buildLesson(input: {
  languageCode: string;
  languageName: string;
  level: string;
  topic: string;
}): Promise<LessonContent> {
  if (!process.env.LOVABLE_API_KEY) {
    return buildFallbackLesson(input);
  }

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
    console.warn("Falling back to built-in lesson content because AI generation failed.", error);
    return buildFallbackLesson(input);
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
