import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getLeaderboard } from "@/lib/lessons.functions";

export const Route = createFileRoute("/_authenticated/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard | NISQAI" },
      { name: "description", content: "See the top NISQAI learners by XP this season." },
      { property: "og:title", content: "Leaderboard | NISQAI" },
      { property: "og:description", content: "See the top NISQAI learners by XP this season." },
    ],
  }),
  component: LeaderboardPage,
});

const MEDALS = ["🥇", "🥈", "🥉"];

function LeaderboardPage() {
  const fetchBoard = useServerFn(getLeaderboard);
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => fetchBoard({}),
  });

  return (
    <div>
      <h1 className="text-3xl">Leaderboard</h1>
      <p className="mt-1 text-muted-foreground">Top learners by XP.</p>
      {isLoading && <p className="mt-4 text-muted-foreground">Loading…</p>}
      <ol className="mt-4 space-y-2">
        {data?.map((row, index) => (
          <li key={row.id} className="card-soft flex items-center gap-3 p-3">
            <span className="w-8 text-center font-display text-lg font-extrabold">
              {MEDALS[index] ?? index + 1}
            </span>
            <span className="flex-1 font-bold">{row.name ?? "Learner"}</span>
            <span className="text-sm font-extrabold text-muted-foreground">{row.streak} 🔥</span>
            <span className="font-display font-extrabold text-gold-foreground">{row.xp} XP</span>
          </li>
        ))}
      </ol>
    </div>
  );
}