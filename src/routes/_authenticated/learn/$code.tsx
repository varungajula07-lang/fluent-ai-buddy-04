import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Lock, Play } from "lucide-react";
import { toast } from "sonner";
import { generateLesson } from "@/lib/lessons.functions";
import { LEVELS, TOPICS, getLanguage, type Level, type LessonContent } from "@/lib/nisqai";
import { LessonPlayer } from "@/components/nisqai/LessonPlayer";

export const Route = createFileRoute("/_authenticated/learn/$code")({
  head: () => ({
    meta: [
      { title: "Learning path | NISQAI" },
      { name: "description", content: "Work through beginner to advanced topics with AI lessons." },
      { property: "og:title", content: "Learning path | NISQAI" },
      {
        property: "og:description",
        content: "Work through beginner to advanced topics with AI lessons.",
      },
    ],
  }),
  component: LearnPath,
});

function LearnPath() {
  const { code } = useParams({ from: "/_authenticated/learn/$code" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const language = getLanguage(code);
  const [level, setLevel] = useState<Level>("Beginner");
  const [lesson, setLesson] = useState<LessonContent | null>(null);

  const create = useServerFn(generateLesson);
  const start = useMutation({
    mutationFn: (topic: string) =>
      create({
        data: {
          languageCode: code,
          languageName: language?.name ?? code,
          level,
          topic,
        },
      }),
    onSuccess: (data) => setLesson(data),
    onError: (error) =>
      toast.error(
        error instanceof Error && error.message.includes("429")
          ? "Busy right now — try again in a moment."
          : "Could not build that lesson. Please try again.",
      ),
  });

  if (!language) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground">That language isn't available.</p>
      </div>
    );
  }

  if (lesson) {
    return (
      <LessonPlayer
        lesson={lesson}
        languageCode={code}
        locale={language.locale}
        level={level}
        onExit={() => {
          setLesson(null);
          void queryClient.invalidateQueries({ queryKey: ["stats"] });
          void navigate({ to: "/learn/$code", params: { code } });
        }}
      />
    );
  }

  return (
    <div>
      <h1 className="flex items-center gap-3 text-3xl">
        <span className="text-4xl">{language.flag}</span> {language.name}
      </h1>

      <div className="mt-4 flex gap-2">
        {LEVELS.map((item) => (
          <button
            key={item}
            onClick={() => setLevel(item)}
            className={`flex-1 rounded-2xl border-2 py-2 text-sm font-extrabold uppercase tracking-wide transition-colors ${
              level === item
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <ol className="mt-6 space-y-3">
        {TOPICS[level].map((topic, index) => (
          <li key={topic}>
            <button
              onClick={() => start.mutate(topic)}
              disabled={start.isPending}
              className="card-soft flex w-full items-center gap-4 p-4 text-left shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 font-display text-lg font-extrabold text-accent-deep">
                {index + 1}
              </span>
              <span className="flex-1">
                <span className="block font-display text-lg font-extrabold">{topic}</span>
                <span className="block text-sm text-muted-foreground">
                  10 words · 5 sentences · dialogue · 5 questions
                </span>
              </span>
              {start.isPending && start.variables === topic ? (
                <span className="text-sm font-bold text-muted-foreground">Building…</span>
              ) : (
                <Play className="h-5 w-5 text-primary" />
              )}
            </button>
          </li>
        ))}
      </ol>

      <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" /> Every lesson is generated live by AI, so no two runs are the
        same.
      </p>
    </div>
  );
}