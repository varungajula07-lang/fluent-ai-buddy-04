import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Volume2, Check, X, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { completeLesson } from "@/lib/lessons.functions";
import type { LessonContent } from "@/lib/nisqai";

type Stage = "words" | "sentences" | "dialogue" | "quiz" | "done";
const ORDER: Stage[] = ["words", "sentences", "dialogue", "quiz"];

function speak(text: string, locale: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export function LessonPlayer({
  lesson,
  languageCode,
  locale,
  level,
  onExit,
}: {
  lesson: LessonContent;
  languageCode: string;
  locale: string;
  level: string;
  onExit: () => void;
}) {
  const [stage, setStage] = useState<Stage>("words");
  const [quizIndex, setQuizIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [weak, setWeak] = useState<string[]>([]);
  const [reward, setReward] = useState<{ xp: number; streak: number } | null>(null);

  const save = useServerFn(completeLesson);
  const finish = useMutation({
    mutationFn: (payload: { score: number; weakPoints: string[] }) =>
      save({
        data: {
          languageCode,
          level,
          topic: lesson.topic,
          score: payload.score,
          total: lesson.quiz.length,
          weakPoints: payload.weakPoints,
        },
      }),
    onSuccess: (data) => setReward(data),
    onError: () => toast.error("Could not save your progress."),
  });

  const stepIndex = ORDER.indexOf(stage);
  const progress =
    stage === "done"
      ? 100
      : ((stepIndex + (stage === "quiz" ? quizIndex / Math.max(lesson.quiz.length, 1) : 0)) /
          ORDER.length) *
        100;

  function next() {
    const i = ORDER.indexOf(stage);
    setStage(i < ORDER.length - 1 ? ORDER[i + 1] : "done");
  }

  const question = lesson.quiz[quizIndex];

  function answer(index: number) {
    if (picked !== null) return;
    setPicked(index);
    const correct = index === question.answerIndex;
    if (correct) setScore((s) => s + 1);
    else setWeak((w) => [...w, question.question]);
  }

  function nextQuestion() {
    const correct = picked === question.answerIndex;
    const nextScore = score;
    const nextWeak = weak;
    setPicked(null);
    if (quizIndex < lesson.quiz.length - 1) {
      setQuizIndex((i) => i + 1);
    } else {
      setStage("done");
      finish.mutate({ score: nextScore, weakPoints: nextWeak });
    }
    void correct;
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <button onClick={onExit} aria-label="Close lesson" className="text-muted-foreground">
          <X className="h-6 w-6" />
        </button>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {stage === "words" && (
        <section>
          <h2 className="text-2xl">New words</h2>
          <ul className="mt-4 space-y-2">
            {lesson.words.map((word) => (
              <li key={word.term} className="card-soft flex items-center gap-3 p-3">
                <button
                  onClick={() => speak(word.term, locale)}
                  aria-label={`Play ${word.term}`}
                  className="text-accent"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
                <div>
                  <p className="font-display text-lg font-extrabold">{word.term}</p>
                  <p className="text-sm text-muted-foreground">
                    {word.translation} · {word.pronunciation}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {stage === "sentences" && (
        <section>
          <h2 className="text-2xl">Sentences</h2>
          <ul className="mt-4 space-y-2">
            {lesson.sentences.map((sentence) => (
              <li key={sentence.text} className="card-soft flex items-start gap-3 p-3">
                <button
                  onClick={() => speak(sentence.text, locale)}
                  aria-label="Play sentence"
                  className="mt-1 text-accent"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
                <div>
                  <p className="font-semibold">{sentence.text}</p>
                  <p className="text-sm text-muted-foreground">{sentence.translation}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {stage === "dialogue" && (
        <section>
          <h2 className="text-2xl">{lesson.dialogue.title}</h2>
          <ul className="mt-4 space-y-3">
            {lesson.dialogue.lines.map((line, i) => (
              <li key={i} className="card-soft p-3">
                <p className="text-xs font-extrabold uppercase tracking-wide text-accent-deep">
                  {line.speaker}
                </p>
                <p className="mt-1 font-semibold">{line.text}</p>
                <p className="text-sm text-muted-foreground">{line.translation}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {stage === "quiz" && question && (
        <section>
          <p className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
            Question {quizIndex + 1} of {lesson.quiz.length}
          </p>
          <h2 className="mt-1 text-2xl">{question.question}</h2>
          <div className="mt-4 space-y-2">
            {question.options.map((option, i) => {
              const isAnswer = i === question.answerIndex;
              const chosen = picked === i;
              const state =
                picked === null
                  ? "border-border"
                  : isAnswer
                    ? "border-accent bg-accent/10"
                    : chosen
                      ? "border-destructive bg-destructive/10"
                      : "border-border opacity-60";
              return (
                <button
                  key={option}
                  onClick={() => answer(i)}
                  className={`w-full rounded-2xl border-2 p-3 text-left font-semibold ${state}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="mt-4 card-soft p-3">
              <p className="flex items-center gap-2 font-extrabold">
                {picked === question.answerIndex ? (
                  <>
                    <Check className="h-5 w-5 text-accent" /> Nicely done!
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-destructive" /> Not quite
                  </>
                )}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{question.explanation}</p>
            </div>
          )}
        </section>
      )}

      {stage === "done" && (
        <section className="py-6 text-center">
          <PartyPopper className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-3 text-3xl">Lesson complete!</h2>
          <p className="mt-2 text-muted-foreground">
            You scored {score} / {lesson.quiz.length}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <div className="card-soft px-5 py-3">
              <p className="text-xs font-extrabold uppercase text-muted-foreground">XP earned</p>
              <p className="font-display text-2xl font-extrabold text-gold-foreground">
                +{reward?.xp ?? "…"}
              </p>
            </div>
            <div className="card-soft px-5 py-3">
              <p className="text-xs font-extrabold uppercase text-muted-foreground">Streak</p>
              <p className="font-display text-2xl font-extrabold text-primary">
                {reward?.streak ?? "…"} 🔥
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="mt-8">
        {stage === "quiz" ? (
          <Button
            onClick={nextQuestion}
            disabled={picked === null}
            className="chunk h-14 w-full rounded-2xl text-base font-extrabold uppercase tracking-wide"
          >
            Continue
          </Button>
        ) : stage === "done" ? (
          <Button
            onClick={onExit}
            className="chunk h-14 w-full rounded-2xl text-base font-extrabold uppercase tracking-wide"
          >
            Back to topics
          </Button>
        ) : (
          <Button
            onClick={next}
            className="chunk h-14 w-full rounded-2xl text-base font-extrabold uppercase tracking-wide"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
