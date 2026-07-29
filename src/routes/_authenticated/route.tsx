import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/nisqai/AppShell";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (typeof window !== "undefined") {
      if (
        window.location.hash.includes("access_token") ||
        window.location.hash.includes("refresh_token")
      ) {
        const { data, error } = await supabase.auth.getSessionFromUrl();
        if (!error && data.session) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
