export type Level = "Beginner" | "Intermediate" | "Advanced";

export const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];

export type LanguageMeta = {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
  locale: string;
  description: string;
};

export type LearningModule = {
  id: string;
  title: string;
  description: string;
  skills: string[];
  topics: string[];
};

export const LANGUAGES: LanguageMeta[] = [
  {
    code: "fr",
    name: "French",
    flag: "🇫🇷",
    nativeName: "Français",
    locale: "fr-FR",
    description: "Everyday conversation, travel phrases, and confident speaking.",
  },
  {
    code: "de",
    name: "German",
    flag: "🇩🇪",
    nativeName: "Deutsch",
    locale: "de-DE",
    description: "Useful routines, social phrases, and professional confidence.",
  },
  {
    code: "es",
    name: "Spanish",
    flag: "🇪🇸",
    nativeName: "Español",
    locale: "es-ES",
    description: "Friendly practice for travel, study, and everyday life.",
  },
  {
    code: "hi",
    name: "Hindi",
    flag: "🇮🇳",
    nativeName: "हिन्दी",
    locale: "hi-IN",
    description: "A warm, practical path to daily conversation and cultural fluency.",
  },
  {
    code: "ja",
    name: "Japanese",
    flag: "🇯🇵",
    nativeName: "日本語",
    locale: "ja-JP",
    description: "Step-by-step modules for polite speech, travel, and real use.",
  },
  {
    code: "pt",
    name: "Portuguese",
    flag: "🇵🇹",
    nativeName: "Português",
    locale: "pt-PT",
    description: "A lively path for travel, culture, and modern conversation.",
  },
  {
    code: "it",
    name: "Italian",
    flag: "🇮🇹",
    nativeName: "Italiano",
    locale: "it-IT",
    description: "Food, travel, music, and everyday phrases in a beautiful cadence.",
  },
  {
    code: "ko",
    name: "Korean",
    flag: "🇰🇷",
    nativeName: "한국어",
    locale: "ko-KR",
    description: "A modern module path for practical speaking and daily life.",
  },
  {
    code: "ar",
    name: "Arabic",
    flag: "🇸🇦",
    nativeName: "العربية",
    locale: "ar-SA",
    description: "Structured lessons for travel, greetings, and everyday confidence.",
  },
];

export function getLanguage(code: string): LanguageMeta | undefined {
  return LANGUAGES.find((l) => l.code === code);
}

export const LEARNING_MODULES: Record<string, LearningModule[]> = {
  fr: [
    {
      id: "travel-fr",
      title: "Travel essentials",
      description: "Get ready for airports, hotels, and day-to-day travel.",
      skills: ["Travel", "Directions", "Politeness"],
      topics: ["At the airport", "Ordering food", "Asking for directions"],
    },
    {
      id: "daily-fr",
      title: "Daily life",
      description: "Learn useful phrases for routines, shopping, and social chat.",
      skills: ["Daily phrases", "Shopping", "Conversation"],
      topics: ["Greetings & introductions", "Food and drinks", "At the market"],
    },
  ],
  de: [
    {
      id: "travel-de",
      title: "Travel essentials",
      description: "Learn practical German for trains, hotels, and public places.",
      skills: ["Travel", "Transport", "Requests"],
      topics: ["Getting around town", "At the hotel", "Ordering food"],
    },
    {
      id: "work-de",
      title: "Work & study",
      description: "Build confidence for classrooms, meetings, and university life.",
      skills: ["Study", "Work", "Meetings"],
      topics: ["Work and study life", "Making plans", "At the doctor"],
    },
  ],
  es: [
    {
      id: "social-es",
      title: "Social speaking",
      description: "Speak naturally in casual, friendly situations.",
      skills: ["Small talk", "Friendship", "Everyday life"],
      topics: ["Greetings & introductions", "Family and people", "Making plans with friends"],
    },
    {
      id: "travel-es",
      title: "Travel essentials",
      description: "Use simple Spanish for restaurants, transport, and sightseeing.",
      skills: ["Travel", "Food", "Directions"],
      topics: ["Getting around town", "Food and drinks", "At the airport"],
    },
  ],
  hi: [
    {
      id: "daily-hi",
      title: "Daily conversations",
      description: "Build practical Hindi for family, daily life, and polite exchanges.",
      skills: ["Greetings", "Family", "Routine"],
      topics: ["Greetings & introductions", "Family and people", "Numbers and time"],
    },
    {
      id: "travel-hi",
      title: "Out and about",
      description: "Learn useful travel phrases for transport and local life.",
      skills: ["Travel", "Directions", "Shopping"],
      topics: ["Getting around town", "Shopping and bargaining", "At the market"],
    },
  ],
  ja: [
    {
      id: "polite-ja",
      title: "Polite speech",
      description: "Practice respectful and useful everyday Japanese.",
      skills: ["Politeness", "Conversation", "Daily phrases"],
      topics: ["Greetings & introductions", "Making plans", "Numbers and time"],
    },
    {
      id: "culture-ja",
      title: "Culture & travel",
      description: "Explore everyday Japanese in travel and social settings.",
      skills: ["Travel", "Food", "Context"],
      topics: ["At the airport", "Food and drinks", "Getting around town"],
    },
  ],
  pt: [
    {
      id: "travel-pt",
      title: "Travel ready",
      description: "Learn functional Portuguese for travel and conversation.",
      skills: ["Travel", "Local life", "Conversation"],
      topics: ["At the airport", "Food and drinks", "Getting around town"],
    },
    {
      id: "social-pt",
      title: "Everyday confidence",
      description: "Develop helpful vocabulary for routines and friendly chats.",
      skills: ["Friendship", "Routine", "Shopping"],
      topics: ["Greetings & introductions", "Shopping and bargaining", "Making plans with friends"],
    },
  ],
  it: [
    {
      id: "food-it",
      title: "Food & city life",
      description: "Enjoy practical Italian for restaurants, streets, and daily use.",
      skills: ["Food", "Travel", "Conversation"],
      topics: ["Food and drinks", "Getting around town", "Ordering food"],
    },
    {
      id: "social-it",
      title: "Everyday chat",
      description: "Pick up common phrases for socializing and everyday life.",
      skills: ["Small talk", "Friendship", "Routine"],
      topics: ["Greetings & introductions", "Family and people", "Making plans with friends"],
    },
  ],
  ko: [
    {
      id: "daily-ko",
      title: "Daily Korean",
      description: "Practice useful phrases for daily routines and polite conversation.",
      skills: ["Politeness", "Routine", "Travel"],
      topics: ["Greetings & introductions", "Numbers and time", "Getting around town"],
    },
    {
      id: "social-ko",
      title: "Social & study",
      description: "Build confidence for class, social settings, and everyday exchange.",
      skills: ["Study", "Conversation", "Friendship"],
      topics: ["Work and study life", "Making plans with friends", "At the doctor"],
    },
  ],
  ar: [
    {
      id: "travel-ar",
      title: "Travel basics",
      description: "Learn helpful Arabic for hotels, transit, and public spaces.",
      skills: ["Travel", "Directions", "Politeness"],
      topics: ["At the airport", "Getting around town", "Greeting people"],
    },
    {
      id: "daily-ar",
      title: "Daily confidence",
      description: "Strengthen Arabic for conversations, food, and everyday routines.",
      skills: ["Food", "Conversation", "Routine"],
      topics: ["Food and drinks", "Greetings & introductions", "Family and people"],
    },
  ],
};

export function getModulesForLanguage(code: string): LearningModule[] {
  return (
    LEARNING_MODULES[code] ?? [
      {
        id: "starter",
        title: "Starter module",
        description: "Build confidence with everyday words, phrases, and simple conversation.",
        skills: ["Basics", "Everyday phrases", "Pronunciation"],
        topics: ["Greetings & introductions", "Numbers and time", "Food and drinks"],
      },
    ]
  );
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
