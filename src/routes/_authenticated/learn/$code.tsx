import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { BookOpen, Lock, Play } from "lucide-react";
import { toast } from "sonner";
import { generateLesson } from "@/lib/lessons.functions";
import {
  LEVELS,
  getLanguage,
  getModulesForLanguage,
  type Level,
  type LessonContent,
} from "@/lib/nisqai";
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
  const modules = getModulesForLanguage(code);
  const [level, setLevel] = useState<Level>("Beginner");
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState(modules[0]?.id ?? "starter");

  useEffect(() => {
    if (modules.length) {
      setSelectedModuleId(modules[0].id);
    }
  }, [code, modules]);

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

  const selectedModule = modules.find((module) => module.id === selectedModuleId) ?? modules[0];

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/20 bg-white/70 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-3xl">
              <span className="text-4xl">{language.flag}</span> {language.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{language.description}</p>
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
            {modules.length} modules
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {LEVELS.map((item) => (
            <button
              key={item}
              onClick={() => setLevel(item)}
              className={`rounded-2xl border-2 px-4 py-2 text-sm font-extrabold uppercase tracking-wide transition-colors ${
                level === item
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-3">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setSelectedModuleId(module.id)}
              className={`w-full rounded-[1.5rem] border p-4 text-left transition-all ${
                selectedModule?.id === module.id
                  ? "border-primary bg-primary/10 shadow-[var(--shadow-card)]"
                  : "border-border bg-background/70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-extrabold">{module.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{module.description}</p>
                </div>
                <BookOpen className="mt-1 h-5 w-5 text-primary" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {module.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-[2rem] border border-white/20 bg-white/70 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl">
          {selectedModule && (
            <>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-primary">
                    {level} path
                  </p>
                  <h2 className="mt-1 text-2xl font-black">{selectedModule.title}</h2>
                </div>
                <div className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent-deep">
                  {selectedModule.topics.length} lessons
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{selectedModule.description}</p>

              <div className="mt-5 space-y-3">
                {selectedModule.topics.map((topic, index) => (
                  <button
                    key={topic}
                    onClick={() => start.mutate(topic)}
                    disabled={start.isPending}
                    className="card-soft flex w-full items-center gap-4 p-4 text-left shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 font-display text-base font-extrabold text-accent-deep">
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
                ))}
              </div>
            </>
          )}

          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" /> Lessons now open as guided modules, and they fall back to
            built-in content when AI is unavailable.
          </p>
        </div>
      </div>
    </div>
  );
}
