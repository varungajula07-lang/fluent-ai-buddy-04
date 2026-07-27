import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in to NISQAI" },
      {
        name: "description",
        content: "Create your free NISQAI account and start learning a language with AI today.",
      },
      { property: "og:title", content: "Sign in to NISQAI" },
      {
        property: "og:description",
        content: "Create your free NISQAI account and start learning a language with AI today.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
        toast.success("Welcome to NISQAI!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <Link to="/" className="mb-6 font-display text-3xl font-extrabold text-primary">
        NISQAI
      </Link>
      <div className="card-soft w-full max-w-sm p-6 shadow-[var(--shadow-float)]">
        <h1 className="text-2xl">{mode === "signup" ? "Start learning free" : "Welcome back"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signup"
            ? "Five languages, AI lessons, and a tutor that never sleeps."
            : "Pick up your streak where you left off."}
        </p>

        <Button
          type="button"
          variant="outline"
          onClick={google}
          className="mt-5 h-12 w-full rounded-2xl border-2 text-base font-bold"
        >
          Continue with Google
        </Button>

        <div className="my-4 flex items-center gap-3 text-xs font-bold text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav"
                className="h-12 rounded-2xl border-2"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-2xl border-2"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-2xl border-2"
            />
          </div>
          <Button
            type="submit"
            disabled={busy}
            className="chunk h-12 w-full rounded-2xl text-base font-extrabold uppercase tracking-wide"
          >
            {busy ? "Please wait..." : mode === "signup" ? "Create account" : "Log in"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          className="mt-4 w-full text-sm font-bold text-accent-deep"
        >
          {mode === "signup" ? "I already have an account" : "New here? Create an account"}
        </button>
      </div>
    </main>
  );
}