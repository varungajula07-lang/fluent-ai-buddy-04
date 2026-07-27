import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, MessageCircleHeart, Sparkles, Trophy } from "lucide-react";
import { LANGUAGES } from "@/lib/nisqai";
import { Button } from "@/components/ui/button";

const TITLE = "NISQAI — Learn a language with an AI tutor";
const DESCRIPTION =
  "Learn French, German, Spanish, Hindi or Japanese with AI-generated lessons, a 24/7 tutor, real-life roleplay, XP and streaks.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI lessons in seconds",
    body: "Ten words, five sentences, a dialogue and a quiz — generated for your level and topic.",
  },
  {
    icon: MessageCircleHeart,
    title: "A tutor that never sleeps",
    body: "Chat freely and get gentle grammar corrections with clear explanations.",
  },
  {
    icon: Flame,
    title: "Streaks and XP",
    body: "Daily practice, earned XP and a streak that keeps you coming back.",
  },
  {
    icon: Trophy,
    title: "Real-life roleplay",
    body: "Airport, restaurant, job interview and small talk — rehearse before it counts.",
  },
];

function Index() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <span className="font-display text-2xl font-extrabold text-primary">NISQAI</span>
        <Link to="/auth">
          <Button className="chunk rounded-2xl px-5 font-extrabold uppercase tracking-wide">
            Get started
          </Button>
        </Link>
      </header>

      <main>
        <section className="mx-auto max-w-3xl px-5 pb-14 pt-8 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-sm font-extrabold text-accent-deep">
            <Sparkles className="h-4 w-4" /> AI-powered language learning
          </p>
          <h1 className="mt-5 font-display text-5xl font-extrabold leading-tight sm:text-6xl">
            Speak a new language,
            <span className="block text-primary">one playful lesson at a time</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">{DESCRIPTION}</p>
          <Link to="/auth" className="mt-8 inline-block">
            <Button className="chunk h-14 rounded-2xl px-10 text-base font-extrabold uppercase tracking-wide">
              Start learning free
            </Button>
          </Link>

          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {LANGUAGES.map((lang) => (
              <li
                key={lang.code}
                className="card-soft flex items-center gap-2 px-4 py-2 font-bold shadow-[var(--shadow-card)]"
              >
                <span className="text-xl">{lang.flag}</span> {lang.name}
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-5xl px-5 pb-20">
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card-soft p-6 shadow-[var(--shadow-card)]">
                <feature.icon className="h-7 w-7 text-primary" />
                <h2 className="mt-3 font-display text-xl font-extrabold">{feature.title}</h2>
                <p className="mt-1 text-muted-foreground">{feature.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} NISQAI · Learn languages the joyful way
      </footer>
    </div>
  );
}
