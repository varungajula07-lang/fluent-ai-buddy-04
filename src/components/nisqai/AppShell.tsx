import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { ReactNode } from "react";
import { Flame, Zap, LogOut } from "lucide-react";
import { getMyStats } from "@/lib/lessons.functions";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/nisqai/ThemeToggle";

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
    <div className="min-h-screen pb-28 bg-background/70 text-foreground">
      <header className="sticky top-0 z-30 border-b-2 border-border/80 bg-background/90 backdrop-blur-xl">
        <div className="relative mx-auto flex max-w-5xl items-center gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="font-display text-2xl font-black tracking-tight text-primary"
            >
              NISQAI
            </Link>
            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Language AI
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary via-gold to-accent opacity-30 blur-xl" />

          <div className="ml-auto flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-gold/20 px-3 py-1 text-sm font-semibold text-gold-foreground shadow-card transition-transform duration-300 hover:-translate-y-0.5">
              <Zap className="h-4 w-4" /> {profile?.xp ?? 0}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary shadow-card transition-transform duration-300 hover:-translate-y-0.5">
              <Flame className="h-4 w-4" /> {profile?.streak ?? 0}
            </span>
            <ThemeToggle />
            <button
              onClick={signOut}
              aria-label="Sign out"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <section className="animate-fadeIn rounded-[2rem] border border-border bg-card/95 p-6 shadow-float transition-all duration-500">
          {children}
        </section>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex-1 border-r border-border/80 px-3 py-3 text-center text-xs font-extrabold uppercase tracking-wide text-muted-foreground transition duration-200 hover:bg-primary/5 hover:text-primary last:border-r-0"
              activeProps={{ className: "text-primary bg-primary/10" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
