import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyStats } from "@/lib/lessons.functions";
import { LanguagePicker } from "@/components/nisqai/LanguagePicker";
import { getLanguage } from "@/lib/nisqai";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your NISQAI dashboard" },
      { name: "description", content: "Track your XP, streak and lesson history on NISQAI." },
      { property: "og:title", content: "Your NISQAI dashboard" },
      {
        property: "og:description",
        content: "Track your XP, streak and lesson history on NISQAI.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const fetchStats = useServerFn(getMyStats);
  const { data, isLoading } = useQuery({ queryKey: ["stats"], queryFn: () => fetchStats({}) });
  const badges = buildBadges(data?.profile?.xp ?? 0, data?.profile?.streak ?? 0);

  const recommendedLanguage = getLanguage(data?.progress?.[0]?.language_code ?? "fr");
  const recommendedCode = recommendedLanguage?.code ?? "fr";

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl">Hey {data?.profile?.name ?? "there"} 👋</h1>
        <p className="mt-1 text-muted-foreground">Ready for today's lesson?</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="XP" value={data?.profile?.xp ?? 0} />
          <Stat label="Streak" value={`${data?.profile?.streak ?? 0} 🔥`} />
          <Stat label="Lessons" value={data?.progress.length ?? 0} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-float transition-transform duration-300 hover:-translate-y-0.5">
          <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-primary">Suggested path</p>
          <h2 className="mt-4 text-3xl font-black">Continue in {recommendedLanguage?.name ?? "French"}</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Jump back into your next AI lesson with a suggested module tailored to your current progress.
          </p>
          <Link
            to="/learn/$code"
            params={{ code: recommendedCode }}
            className="mt-6 inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary-deep"
          >
            Continue learning
          </Link>
        </div>

        <div className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-float">
          <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-muted-foreground">Tip</p>
          <p className="mt-4 text-lg font-bold">Explore lessons by topic and level.</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Pick a language, choose a learning module, and generate a lesson with words, sentences,
            dialogue, and a quiz. Each step builds your confidence with friendly practice.
          </p>
          <div className="mt-6 grid gap-3">
            <div className="rounded-3xl bg-primary/10 p-4 text-sm text-primary">
              <strong>Beginner</strong> modules help you start speaking right away.
            </div>
            <div className="rounded-3xl bg-accent/10 p-4 text-sm text-accent-deep">
              <strong>Intermediate</strong> lessons deepen vocabulary and real-life dialogue.
            </div>
            <div className="rounded-3xl bg-muted p-4 text-sm text-muted-foreground">
              <strong>Advanced</strong> content boosts fluency and comprehension.
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl">Pick a language</h2>
        <div className="mt-3">
          <LanguagePicker />
        </div>
      </section>

      <section>
        <h2 className="text-2xl">Badges</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <li
              key={badge.label}
              className={`card-soft px-4 py-2 font-bold ${badge.earned ? "" : "opacity-40"}`}
            >
              {badge.emoji} {badge.label}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl">Recent activity</h2>
        {isLoading && <p className="mt-2 text-muted-foreground">Loading…</p>}
        {!isLoading && (data?.progress.length ?? 0) === 0 && (
          <p className="mt-2 text-muted-foreground">
            No lessons yet —{" "}
            <Link to="/learn" className="font-bold text-primary">
              start your first one
            </Link>
            .
          </p>
        )}
        <ul className="mt-3 space-y-2">
          {data?.progress.slice(0, 8).map((row, i) => (
            <li key={i} className="card-soft flex items-center justify-between p-3">
              <span>
                <span className="block font-bold">{row.topic}</span>
                <span className="block text-sm text-muted-foreground">
                  {getLanguage(row.language_code)?.name ?? row.language_code} · {row.level}
                </span>
              </span>
              <span className="font-display font-extrabold text-accent-deep">
                {row.score}/{row.total}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card-soft p-4 text-center">
      <p className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="font-display text-2xl font-extrabold">{value}</p>
    </div>
  );
}

function buildBadges(xp: number, streak: number) {
  return [
    { emoji: "🌱", label: "First steps", earned: xp > 0 },
    { emoji: "⚡", label: "100 XP", earned: xp >= 100 },
    { emoji: "🏅", label: "500 XP", earned: xp >= 500 },
    { emoji: "🔥", label: "3-day streak", earned: streak >= 3 },
    { emoji: "💎", label: "7-day streak", earned: streak >= 7 },
  ];
}
