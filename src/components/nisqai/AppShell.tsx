import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { ReactNode } from "react";
import { Flame, Zap, LogOut } from "lucide-react";
import { getMyStats } from "@/lib/lessons.functions";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/dashboard", label: "Home" },
  { to: "/learn", label: "Learn" },
  { to: "/tutor", label: "Tutor" },
  { to: "/scenarios", label: "Real life" },
  { to: "/leaderboard", label: "Ranks" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const fetchStats = useServerFn(getMyStats);
  const { data } = useQuery({ queryKey: ["stats"], queryFn: () => fetchStats({}) });
  const profile = data?.profile;

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 border-b-2 border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <Link to="/dashboard" className="font-display text-xl font-extrabold text-primary">
            NISQAI
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-gold/20 px-3 py-1 text-sm font-extrabold text-gold-foreground">
              <Zap className="h-4 w-4" /> {profile?.xp ?? 0}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-sm font-extrabold text-primary">
              <Flame className="h-4 w-4" /> {profile?.streak ?? 0}
            </span>
            <button
              onClick={signOut}
              aria-label="Sign out"
              className="rounded-full p-2 text-muted-foreground hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-border bg-card">
        <div className="mx-auto flex max-w-4xl">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex-1 py-3 text-center text-xs font-extrabold uppercase tracking-wide text-muted-foreground transition-colors"
              activeProps={{ className: "text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}