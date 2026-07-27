import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import type { LessonContent } from "./nisqai";

const GenerateInput = z.object({
  languageCode: z.string(),
  languageName: z.string(),
  level: z.string(),
  topic: z.string(),
});

export const generateLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => GenerateInput.parse(d))
  .handler(async ({ data }): Promise<LessonContent> => {
    const { buildLesson } = await import("./lesson-generator.server");
    return buildLesson(data);
  });

const ProgressInput = z.object({
  languageCode: z.string(),
  level: z.string(),
  topic: z.string(),
  score: z.number(),
  total: z.number(),
  weakPoints: z.array(z.string()),
});

export const completeLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ProgressInput.parse(d))
  .handler(async ({ data, context }) => {
    const xp = 10 + Math.round((data.score / Math.max(data.total, 1)) * 20);
    const { error } = await context.supabase.from("nisqai_progress").insert({
      user_id: context.userId,
      language_code: data.languageCode,
      level: data.level,
      topic: data.topic,
      completed: true,
      score: data.score,
      total: data.total,
      xp_earned: xp,
      weak_points: data.weakPoints,
    });
    if (error) throw new Error(error.message);

    const { data: profile } = await context.supabase
      .from("nisqai_users")
      .select("xp, streak, last_active_date")
      .eq("id", context.userId)
      .maybeSingle();

    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const last = profile?.last_active_date ?? null;
    let streak = profile?.streak ?? 0;
    if (last !== today) streak = last === yesterday ? streak + 1 : 1;

    await context.supabase
      .from("nisqai_users")
      .update({
        xp: (profile?.xp ?? 0) + xp,
        streak,
        last_active_date: today,
      })
      .eq("id", context.userId);

    return { xp, streak };
  });

export const getMyStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: profile }, { data: progress }] = await Promise.all([
      context.supabase
        .from("nisqai_users")
        .select("id, name, email, xp, streak, level, plan")
        .eq("id", context.userId)
        .maybeSingle(),
      context.supabase
        .from("nisqai_progress")
        .select("language_code, level, topic, score, total, xp_earned, weak_points, created_at")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    return { profile, progress: progress ?? [] };
  });

export const getLeaderboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("nisqai_users")
      .select("id, name, xp, streak")
      .order("xp", { ascending: false })
      .limit(20);
    return data ?? [];
  });