export type Level = "Beginner" | "Intermediate" | "Advanced";

export const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];

export type LanguageMeta = {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
  locale: string;
};

export const LANGUAGES: LanguageMeta[] = [
  { code: "fr", name: "French", flag: "🇫🇷", nativeName: "Français", locale: "fr-FR" },
  { code: "de", name: "German", flag: "🇩🇪", nativeName: "Deutsch", locale: "de-DE" },
  { code: "es", name: "Spanish", flag: "🇪🇸", nativeName: "Español", locale: "es-ES" },
  { code: "hi", name: "Hindi", flag: "🇮🇳", nativeName: "हिन्दी", locale: "hi-IN" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", nativeName: "日本語", locale: "ja-JP" },
];

export function getLanguage(code: string): LanguageMeta | undefined {
  return LANGUAGES.find((l) => l.code === code);
}

export const TOPICS: Record<Level, string[]> = {
  Beginner: [
    "Greetings & introductions",
    "Numbers and time",
    "Family and people",
    "Food and drinks",
    "Getting around town",
  ],
  Intermediate: [
    "Shopping and bargaining",
    "Making plans with friends",
    "At the doctor",
    "Work and study life",
    "Describing past events",
  ],
  Advanced: [
    "Debating opinions",
    "Business negotiation",
    "Idioms and slang",
    "News and current affairs",
    "Storytelling and nuance",
  ],
};

export type Scenario = {
  id: string;
  title: string;
  emoji: string;
  blurb: string;
  brief: string;
};

export const SCENARIOS: Scenario[] = [
  {
    id: "airport",
    title: "At the airport",
    emoji: "✈️",
    blurb: "Check in, find your gate, survive a delay.",
    brief:
      "You are an airline check-in agent at a busy international airport. Help the traveller check in, weigh baggage, and find their gate.",
  },
  {
    id: "restaurant",
    title: "Restaurant",
    emoji: "🍽️",
    blurb: "Order, ask about dishes, split the bill.",
    brief:
      "You are a friendly waiter at a popular local restaurant. Greet the guest, take their order, recommend dishes and bring the bill.",
  },
  {
    id: "interview",
    title: "Job interview",
    emoji: "💼",
    blurb: "Introduce yourself and answer tough questions.",
    brief:
      "You are a hiring manager interviewing the learner for a job. Ask about experience, strengths and motivation, one question at a time.",
  },
  {
    id: "daily",
    title: "Daily small talk",
    emoji: "☕",
    blurb: "Weather, weekend plans, neighbours.",
    brief:
      "You are a chatty neighbour meeting the learner at a coffee shop. Make casual small talk about weather, plans and daily life.",
  },
];

export function getScenario(id: string) {
  return SCENARIOS.find((s) => s.id === id);
}

export type LessonContent = {
  topic: string;
  words: { term: string; translation: string; pronunciation: string }[];
  sentences: { text: string; translation: string }[];
  dialogue: {
    title: string;
    lines: { speaker: string; text: string; translation: string }[];
  };
  quiz: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  }[];
};

export function xpForScore(score: number, total: number) {
  if (total === 0) return 0;
  return 10 + Math.round((score / total) * 20);
}