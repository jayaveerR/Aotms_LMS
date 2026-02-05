 -- =====================
 -- ADD MANAGER ROLE TO ENUM
 -- =====================
 
 ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manager';
 
 -- =====================
 -- MANAGER FEATURE TABLES
 -- =====================
 
 -- Question Bank - Topic-wise question papers
 CREATE TABLE public.question_bank (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     topic TEXT NOT NULL,
     course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
     question_text TEXT NOT NULL,
     question_type TEXT NOT NULL CHECK (question_type IN ('mcq', 'true_false', 'short_answer', 'long_answer')),
     options JSONB DEFAULT '[]'::jsonb,
     correct_answer TEXT,
     marks INTEGER DEFAULT 1,
     difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
     explanation TEXT,
     created_by UUID REFERENCES auth.users(id),
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMPTZ DEFAULT now(),
     updated_at TIMESTAMPTZ DEFAULT now()
 );
 
 -- Exam Schedules - Daily exam scheduling
 CREATE TABLE public.exam_schedules (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title TEXT NOT NULL,
     description TEXT,
     course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
     topic TEXT,
     scheduled_date DATE NOT NULL,
     start_time TIME NOT NULL,
     end_time TIME NOT NULL,
     exam_type TEXT DEFAULT 'daily' CHECK (exam_type IN ('daily', 'weekly', 'mock', 'live', 'final')),
     question_paper_id UUID,
     status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
     created_by UUID REFERENCES auth.users(id),
     created_at TIMESTAMPTZ DEFAULT now()
 );
 
 -- Exam Rules Configuration
 CREATE TABLE public.exam_rules (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     exam_id UUID REFERENCES public.live_exams(id) ON DELETE CASCADE,
     exam_schedule_id UUID REFERENCES public.exam_schedules(id) ON DELETE CASCADE,
     duration_minutes INTEGER NOT NULL DEFAULT 60,
     total_questions INTEGER NOT NULL DEFAULT 50,
     total_marks INTEGER NOT NULL DEFAULT 100,
     passing_marks INTEGER DEFAULT 40,
     negative_marking BOOLEAN DEFAULT false,
     negative_marks_per_question DECIMAL(3,2) DEFAULT 0.25,
     max_attempts INTEGER DEFAULT 1,
     shuffle_questions BOOLEAN DEFAULT true,
     shuffle_options BOOLEAN DEFAULT true,
     show_results_immediately BOOLEAN DEFAULT true,
     allow_review BOOLEAN DEFAULT true,
     proctoring_enabled BOOLEAN DEFAULT false,
     created_at TIMESTAMPTZ DEFAULT now(),
     updated_at TIMESTAMPTZ DEFAULT now()
 );
 
 -- Guest Credentials
 CREATE TABLE public.guest_credentials (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     username TEXT NOT NULL UNIQUE,
     password_hash TEXT NOT NULL,
     display_name TEXT,
     email TEXT,
     access_level TEXT DEFAULT 'limited' CHECK (access_level IN ('limited', 'view_only', 'demo')),
     allowed_courses UUID[] DEFAULT '{}',
     expires_at TIMESTAMPTZ,
     is_active BOOLEAN DEFAULT true,
     max_sessions INTEGER DEFAULT 1,
     created_by UUID REFERENCES auth.users(id),
     last_login_at TIMESTAMPTZ,
     created_at TIMESTAMPTZ DEFAULT now()
 );
 
 -- Guest access view (hides password_hash)
 CREATE VIEW public.guest_credentials_public
 WITH (security_invoker=on) AS
   SELECT id, username, display_name, email, access_level, allowed_courses, 
          expires_at, is_active, max_sessions, last_login_at, created_at
   FROM public.guest_credentials;
 
 -- Mock Test Assignments
 CREATE TABLE public.mock_test_assignments (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     mock_paper_id UUID REFERENCES public.mock_papers(id) ON DELETE CASCADE NOT NULL,
     assigned_to UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     assigned_to_course UUID REFERENCES public.courses(id) ON DELETE CASCADE,
     assigned_by UUID REFERENCES auth.users(id) NOT NULL,
     due_date TIMESTAMPTZ,
     is_mandatory BOOLEAN DEFAULT false,
     status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'expired')),
     created_at TIMESTAMPTZ DEFAULT now()
 );
 
 -- Instructor Progress Tracking (for managers to monitor)
 CREATE TABLE public.instructor_progress (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     instructor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
     course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
     topics_planned INTEGER DEFAULT 0,
     topics_completed INTEGER DEFAULT 0,
     videos_uploaded INTEGER DEFAULT 0,
     resources_uploaded INTEGER DEFAULT 0,
     live_classes_conducted INTEGER DEFAULT 0,
     last_activity_at TIMESTAMPTZ DEFAULT now(),
     notes TEXT,
     updated_at TIMESTAMPTZ DEFAULT now(),
     UNIQUE (instructor_id, course_id)
 );
 
 -- Leaderboard Audit Log (for validation)
 CREATE TABLE public.leaderboard_audit (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
     action TEXT NOT NULL CHECK (action IN ('score_update', 'rank_change', 'manual_adjustment', 'validation', 'flag')),
     previous_score INTEGER,
     new_score INTEGER,
     previous_rank INTEGER,
     new_rank INTEGER,
     reason TEXT,
     performed_by UUID REFERENCES auth.users(id),
     created_at TIMESTAMPTZ DEFAULT now()
 );
 
 -- =====================
 -- HELPER FUNCTIONS
 -- =====================
 
 -- Check if user is a manager
 CREATE OR REPLACE FUNCTION public.is_manager(_user_id UUID)
 RETURNS BOOLEAN
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET search_path = public
 AS $$
   SELECT public.has_role(_user_id, 'manager')
 $$;
 
 -- Check if user is admin or manager
 CREATE OR REPLACE FUNCTION public.is_admin_or_manager(_user_id UUID)
 RETURNS BOOLEAN
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET search_path = public
 AS $$
   SELECT public.has_role(_user_id, 'admin') OR public.has_role(_user_id, 'manager')
 $$;
 
 -- =====================
 -- ENABLE RLS
 -- =====================
 
 ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.exam_schedules ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.exam_rules ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.guest_credentials ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.mock_test_assignments ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.instructor_progress ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.leaderboard_audit ENABLE ROW LEVEL SECURITY;
 
 -- =====================
 -- RLS POLICIES - MANAGER ACCESS
 -- =====================
 
 -- Question Bank: Managers can full access, instructors can view/create for their courses
 CREATE POLICY "Managers can manage question bank"
 ON public.question_bank FOR ALL
 USING (public.is_admin_or_manager(auth.uid()));
 
 CREATE POLICY "Instructors can view questions for their courses"
 ON public.question_bank FOR SELECT
 USING (
   public.is_instructor(auth.uid()) 
   AND (course_id IS NULL OR public.is_course_instructor(auth.uid(), course_id))
 );
 
 CREATE POLICY "Instructors can create questions for their courses"
 ON public.question_bank FOR INSERT
 WITH CHECK (
   public.is_instructor(auth.uid()) 
   AND public.is_course_instructor(auth.uid(), course_id)
 );
 
 -- Exam Schedules: Managers have full access
 CREATE POLICY "Managers can manage exam schedules"
 ON public.exam_schedules FOR ALL
 USING (public.is_admin_or_manager(auth.uid()));
 
 CREATE POLICY "Instructors can view exam schedules for their courses"
 ON public.exam_schedules FOR SELECT
 USING (public.is_course_instructor(auth.uid(), course_id));
 
 CREATE POLICY "Students can view their exam schedules"
 ON public.exam_schedules FOR SELECT
 USING (public.is_enrolled(auth.uid(), course_id));
 
 -- Exam Rules: Managers can manage
 CREATE POLICY "Managers can manage exam rules"
 ON public.exam_rules FOR ALL
 USING (public.is_admin_or_manager(auth.uid()));
 
 CREATE POLICY "Authenticated users can view exam rules"
 ON public.exam_rules FOR SELECT TO authenticated
 USING (true);
 
 -- Guest Credentials: Only managers/admins (direct table access denied)
 CREATE POLICY "No direct access to guest credentials"
 ON public.guest_credentials FOR SELECT
 USING (false);
 
 CREATE POLICY "Managers can manage guest credentials"
 ON public.guest_credentials FOR ALL
 USING (public.is_admin_or_manager(auth.uid()));
 
 -- Mock Test Assignments: Managers can assign
 CREATE POLICY "Managers can manage mock assignments"
 ON public.mock_test_assignments FOR ALL
 USING (public.is_admin_or_manager(auth.uid()));
 
 CREATE POLICY "Users can view their assignments"
 ON public.mock_test_assignments FOR SELECT
 USING (auth.uid() = assigned_to);
 
 CREATE POLICY "Instructors can view course assignments"
 ON public.mock_test_assignments FOR SELECT
 USING (public.is_course_instructor(auth.uid(), assigned_to_course));
 
 -- Instructor Progress: Managers can view/update all, instructors can view own
 CREATE POLICY "Managers can manage instructor progress"
 ON public.instructor_progress FOR ALL
 USING (public.is_admin_or_manager(auth.uid()));
 
 CREATE POLICY "Instructors can view own progress"
 ON public.instructor_progress FOR SELECT
 USING (auth.uid() = instructor_id);
 
 -- Leaderboard Audit: Only managers/admins
 CREATE POLICY "Managers can manage leaderboard audit"
 ON public.leaderboard_audit FOR ALL
 USING (public.is_admin_or_manager(auth.uid()));