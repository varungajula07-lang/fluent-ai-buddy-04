import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChatPanel } from "@/components/nisqai/ChatPanel";
import { LANGUAGES, LEVELS, type Level } from "@/lib/nisqai";

export const Route = createFileRoute("/_authenticated/tutor")({
  head: () => ({
    meta: [
      { title: "AI tutor | NISQAI" },
      {
        name: "description",
        content: "Chat with the NISQAI tutor and get instant grammar corrections.",
      },
      { property: "og:title", content: "AI tutor | NISQAI" },
      {
        property: "og:description",
        content: "Chat with the NISQAI tutor and get instant grammar corrections.",
      },
    ],
  }),
  component: TutorPage,
});

function TutorPage() {
  const [code, setCode] = useState(LANGUAGES[0].code);
  const [level, setLevel] = useState<Level>("Beginner");
  const language = LANGUAGES.find((l) => l.code === code)!;

  return (
    <div>
      <h1 className="text-3xl">AI tutor</h1>
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

      <div className="mt-4">
        <ChatPanel
          chatId={`tutor-${code}-${level}`}
          languageName={language.name}
          level={level}
          mode="tutor"
          starter={`Say hello in ${language.name} — I'll correct you kindly and explain why.`}
        />
      </div>
    </div>
  );
}