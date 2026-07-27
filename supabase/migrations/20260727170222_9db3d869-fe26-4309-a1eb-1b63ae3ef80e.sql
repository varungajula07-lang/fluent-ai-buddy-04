-- Users profile table (keyed to auth user id)
CREATE TABLE public.nisqai_users (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT,
  xp INT NOT NULL DEFAULT 0,
  streak INT NOT NULL DEFAULT 0,
  last_active_date DATE,
  level TEXT NOT NULL DEFAULT 'Beginner',
  plan TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nisqai_users TO authenticated;
GRANT SELECT ON public.nisqai_users TO anon;
GRANT ALL ON public.nisqai_users TO service_role;
ALTER TABLE public.nisqai_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON public.nisqai_users FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Leaderboard is public" ON public.nisqai_users FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.nisqai_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  flag TEXT NOT NULL DEFAULT '',
  native_name TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
);
GRANT SELECT ON public.nisqai_languages TO anon, authenticated;
GRANT ALL ON public.nisqai_languages TO service_role;
ALTER TABLE public.nisqai_languages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Languages are public" ON public.nisqai_languages FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.nisqai_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_id UUID REFERENCES public.nisqai_languages(id) ON DELETE CASCADE,
  level TEXT NOT NULL,
  topic TEXT NOT NULL,
  content JSONB,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.nisqai_lessons TO authenticated;
GRANT SELECT ON public.nisqai_lessons TO anon;
GRANT ALL ON public.nisqai_lessons TO service_role;
ALTER TABLE public.nisqai_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lessons are readable" ON public.nisqai_lessons FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users can add lessons" ON public.nisqai_lessons FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE TABLE public.nisqai_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  language_code TEXT NOT NULL,
  level TEXT NOT NULL,
  topic TEXT NOT NULL,
  lesson_id UUID REFERENCES public.nisqai_lessons(id) ON DELETE SET NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  score INT NOT NULL DEFAULT 0,
  total INT NOT NULL DEFAULT 0,
  xp_earned INT NOT NULL DEFAULT 0,
  weak_points TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nisqai_progress TO authenticated;
GRANT ALL ON public.nisqai_progress TO service_role;
ALTER TABLE public.nisqai_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own progress" ON public.nisqai_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.nisqai_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.nisqai_subscriptions TO authenticated;
GRANT ALL ON public.nisqai_subscriptions TO service_role;
ALTER TABLE public.nisqai_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own subscriptions" ON public.nisqai_subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.nisqai_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount INT NOT NULL DEFAULT 0,
  plan TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'created',
  provider_payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.nisqai_payments TO authenticated;
GRANT ALL ON public.nisqai_payments TO service_role;
ALTER TABLE public.nisqai_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own payments" ON public.nisqai_payments FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_nisqai_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.nisqai_users (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_nisqai
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_nisqai_user();

INSERT INTO public.nisqai_languages (name, code, flag, native_name, sort_order) VALUES
  ('French', 'fr', '🇫🇷', 'Français', 1),
  ('German', 'de', '🇩🇪', 'Deutsch', 2),
  ('Spanish', 'es', '🇪🇸', 'Español', 3),
  ('Hindi', 'hi', '🇮🇳', 'हिन्दी', 4),
  ('Japanese', 'ja', '🇯🇵', '日本語', 5);