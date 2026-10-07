-- ====================================================
-- FakeShield Supabase Schema & Security Policies
-- Problem ID: CS6 - Indicative Website Risk Assessment Platform
-- ====================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SCANS TABLE
CREATE TABLE IF NOT EXISTS public.scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    domain TEXT,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SCAN FINDINGS TABLE
CREATE TABLE IF NOT EXISTS public.scan_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL REFERENCES public.scans(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('SAFE', 'INFO', 'WARNING', 'HIGH')),
    description TEXT NOT NULL,
    risk_points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================
-- INDEXES
-- ====================================================
CREATE INDEX IF NOT EXISTS scans_user_id_idx ON public.scans(user_id);
CREATE INDEX IF NOT EXISTS scans_created_at_idx ON public.scans(created_at DESC);
CREATE INDEX IF NOT EXISTS scan_findings_scan_id_idx ON public.scan_findings(scan_id);

-- ====================================================
-- TABLE PERMISSIONS FOR SUPABASE API
-- ====================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.profiles TO anon, authenticated;
GRANT ALL ON TABLE public.scans TO anon, authenticated;
GRANT ALL ON TABLE public.scan_findings TO anon, authenticated;

-- ====================================================
-- ROW LEVEL SECURITY (RLS)
-- ====================================================

-- PROFILES RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = (SELECT auth.uid()))
    WITH CHECK (id = (SELECT auth.uid()));

-- SCANS RLS
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own scans" ON public.scans;
CREATE POLICY "Users can view their own scans"
    ON public.scans FOR SELECT
    TO authenticated
    USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own scans" ON public.scans;
CREATE POLICY "Users can insert their own scans"
    ON public.scans FOR INSERT
    TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own scans" ON public.scans;
CREATE POLICY "Users can update their own scans"
    ON public.scans FOR UPDATE
    TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own scans" ON public.scans;
CREATE POLICY "Users can delete their own scans"
    ON public.scans FOR DELETE
    TO authenticated
    USING (user_id = (SELECT auth.uid()));

-- SCAN FINDINGS RLS
ALTER TABLE public.scan_findings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view findings for their own scans" ON public.scan_findings;
CREATE POLICY "Users can view findings for their own scans"
    ON public.scan_findings FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.scans
            WHERE scans.id = scan_findings.scan_id
              AND scans.user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can insert findings for their own scans" ON public.scan_findings;
CREATE POLICY "Users can insert findings for their own scans"
    ON public.scan_findings FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.scans
            WHERE scans.id = scan_findings.scan_id
              AND scans.user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can delete findings for their own scans" ON public.scan_findings;
CREATE POLICY "Users can delete findings for their own scans"
    ON public.scan_findings FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.scans
            WHERE scans.id = scan_findings.scan_id
              AND scans.user_id = (SELECT auth.uid())
        )
    );

-- ====================================================
-- AUTOMATIC PROFILE CREATION FUNCTION & OPTIONAL TRIGGER
-- (Note: The frontend client also automatically creates and syncs
--  profiles on registration as a built-in safety net)
-- ====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, created_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'fullName', ''),
        NEW.email,
        NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email;
    RETURN NEW;
END;
$$;

-- Run trigger creation inside a DO block so it succeeds even if auth schema permissions vary
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'auth' AND table_name = 'users'
    ) THEN
        BEGIN
            DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
            CREATE TRIGGER on_auth_user_created
                AFTER INSERT ON auth.users
                FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Trigger on auth.users skipped due to role permissions (client fallback will handle profile creation): %', SQLERRM;
        END;
    END IF;
END $$;
