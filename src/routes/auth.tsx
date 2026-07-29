import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/nisqai/ThemeToggle";

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
    if (typeof window === "undefined") return;

    async function resolveUrlSession() {
      if (
        window.location.hash.includes("access_token") ||
        window.location.hash.includes("refresh_token")
      ) {
        const { data, error } = await supabase.auth.getSessionFromUrl();
        if (!error && data.session) {
          window.history.replaceState(null, "", window.location.pathname);
          navigate({ to: "/dashboard" });
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (data.session) navigate({ to: "/dashboard" });
    }

    resolveUrlSession();
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
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      const message = error.message.includes("provider is not enabled")
        ? "Google login is not enabled in Supabase Auth. Enable Google under Supabase Auth > Providers and set the correct redirect URI."
        : error.message || "Google sign-in failed. Please try again.";
      toast.error(message);
      return;
    }

    if (data?.url) {
      window.location.assign(data.url);
    }
  }

  return (
    <main className="auth-page relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-12">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      <div className="relative z-10 w-full max-w-4xl px-4">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Link
            to="/"
            className="font-display text-4xl font-black tracking-tight text-primary md:text-5xl"
          >
            NISQAI
          </Link>
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            A beautiful AI language learning experience with instant lessons, friendly progress
            tracking, and modern sign-in flows.
          </p>
        </div>

        <div className="auth-card mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-border/50 bg-card/95 p-8 shadow-[var(--shadow-float)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_80px_-40px_rgba(0,0,0,0.45)]">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="space-y-3">
              <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-primary">
                Fast setup
              </p>
              <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                {mode === "signup" ? "Start learning language with AI" : "Welcome back to NISQAI"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {mode === "signup"
                  ? "Join thousands of learners and practice with smart, adaptive lessons."
                  : "Log in and continue your streak with personalized AI tutoring."}
              </p>
            </div>
            <ThemeToggle />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={google}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-3xl border-2 border-[#1f2937] bg-white text-base font-bold text-[#111827] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4285F4"
                d="M22.5 12.26c0-.72-.06-1.41-.17-2.08H12v3.94h5.92c-.26 1.42-1.03 2.62-2.2 3.42v2.84h3.57c2.1-1.93 3.31-4.8 3.31-8.12z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-1 7.28-2.7l-3.57-2.84c-.99.66-2.25 1.05-3.71 1.05-2.86 0-5.29-1.93-6.16-4.54H2.2v2.85C3.99 20.92 7.74 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.97c-.22-.66-.35-1.36-.35-2.07s.13-1.41.35-2.07V8.0H2.2A9.988 9.988 0 0 0 1 12.9c0 1.64.4 3.19 1.2 4.56l2.64-2.49z"
              />
              <path
                fill="#EA4335"
                d="M12 4.5c1.62 0 3.08.56 4.22 1.65l3.16-3.16C17.42 1.18 14.97 0 12 0 7.74 0 3.99 2.08 2.2 5.85l2.64 2.85C6.71 6.43 9.14 4.5 12 4.5z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-px flex-1 bg-border/80" />
            or sign in with email
            <span className="h-px flex-1 bg-border/80" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aarav"
                  className="h-12 rounded-3xl border-2"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-3xl border-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-3xl border-2"
              />
            </div>
            <Button
              type="submit"
              disabled={busy}
              className="chunk h-14 w-full rounded-3xl bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-deep"
            >
              {busy ? "Please wait..." : mode === "signup" ? "Create account" : "Log in"}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="mt-5 w-full text-sm font-bold text-primary transition-colors hover:text-primary-deep"
          >
            {mode === "signup" ? "I already have an account" : "New here? Create an account"}
          </button>
        </div>
      </div>
    </main>
  );
}
