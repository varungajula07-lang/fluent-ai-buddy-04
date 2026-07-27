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

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl">Hey {data?.profile?.name ?? "there"} 👋</h1>
        <p className="mt-1 text-muted-foreground">Ready for today's lesson?</p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="XP" value={data?.profile?.xp ?? 0} />
          <Stat label="Streak" value={`${data?.profile?.streak ?? 0} 🔥`} />
          <Stat label="Lessons" value={data?.progress.length ?? 0} />
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
            No lessons yet — <Link to="/learn" className="font-bold text-primary">start your first one</Link>.
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