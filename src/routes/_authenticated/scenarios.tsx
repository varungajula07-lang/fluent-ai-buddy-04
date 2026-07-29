import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChatPanel } from "@/components/nisqai/ChatPanel";
import { LANGUAGES, LEVELS, SCENARIOS, type Level } from "@/lib/nisqai";

export const Route = createFileRoute("/_authenticated/scenarios")({
  head: () => ({
    meta: [
      { title: "Real-life practice | NISQAI" },
      {
        name: "description",
        content: "Roleplay the airport, a restaurant or a job interview with your AI partner.",
      },
      { property: "og:title", content: "Real-life practice | NISQAI" },
      {
        property: "og:description",
        content: "Roleplay the airport, a restaurant or a job interview with your AI partner.",
      },
    ],
  }),
  component: ScenariosPage,
});

function ScenariosPage() {
  const [code, setCode] = useState(LANGUAGES[0].code);
  const [level, setLevel] = useState<Level>("Beginner");
  const [active, setActive] = useState<string | null>(null);
  const language = LANGUAGES.find((l) => l.code === code)!;
  const scenario = SCENARIOS.find((s) => s.id === active);

  if (scenario) {
    return (
      <div>
        <button
          onClick={() => setActive(null)}
          className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground"
        >
          ← All scenarios
        </button>
        <h1 className="mt-2 text-2xl">
          {scenario.emoji} {scenario.title} · {language.name}
        </h1>
        <div className="mt-3">
          <ChatPanel
            chatId={`scenario-${scenario.id}-${code}-${level}`}
            languageName={language.name}
            level={level}
            mode="scenario"
            scenarioBrief={scenario.brief}
            starter={`Start the conversation in ${language.name} — your partner will stay in character.`}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl">Real-life practice</h1>
      <p className="mt-1 text-muted-foreground">Rehearse the moments that actually happen.</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <select
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="card-soft px-3 py-2 font-bold"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as Level)}
          className="card-soft px-3 py-2 font-bold"
        >
          {LEVELS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {SCENARIOS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className="card-soft p-5 text-left shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5"
          >
            <span className="text-3xl">{item.emoji}</span>
            <span className="mt-2 block font-display text-lg font-extrabold">{item.title}</span>
            <span className="block text-sm text-muted-foreground">{item.blurb}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
