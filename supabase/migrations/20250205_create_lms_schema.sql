 -- Create role enum
 CREATE TYPE public.app_role AS ENUM ('admin', 'instructor', 'student');
 
 -- =====================
 -- BASE TABLES
 -- =====================
 
 -- Profiles table
 CREATE TABLE public.profiles (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
     full_name TEXT,
     email TEXT,
     phone TEXT,
     bio TEXT,
     date_of_birth DATE,
     avatar_url TEXT,
     education JSONB DEFAULT '[]'::jsonb,
     skills JSONB DEFAULT '[]'::jsonb,
     certifications JSONB DEFAULT '[]'::jsonb,
     ats_score INTEGER DEFAULT 0,
     created_at TIMESTAMPTZ DEFAULT now(),
     updated_at TIMESTAMPTZ DEFAULT now()
 );
 
 -- User roles table (separate from profiles for security)
 CREATE TABLE public.user_roles (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
     role app_role NOT NULL,
     created_at TIMESTAMPTZ DEFAULT now(),
     UNIQUE (user_id, role)
 );
 
 -- Courses table
 CREATE TABLE public.courses (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title TEXT NOT NULL,
     description TEXT,
     instructor_id UUID REFERENCES auth.users(id),
     thumbnail_url TEXT,
     duration_hours INTEGER DEFAULT 0,
     is_published BOOLEAN DEFAULT false,
     created_at TIMESTAMPTZ DEFAULT now(),
     updated_at TIMESTAMPTZ DEFAULT now()
 );
 
 -- Course enrollments
 CREATE TABLE public.course_enrollments (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
     course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
     enrolled_at TIMESTAMPTZ DEFAULT now(),
     status TEXT DEFAULT 'active',
     progress_percentage INTEGER DEFAULT 0,
     UNIQUE (user_id, course_id)
 );
 
 -- Videos (recorded lectures)
 CREATE TABLE public.videos (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
     title TEXT NOT NULL,
     description TEXT,
     video_url TEXT,
     duration_minutes INTEGER DEFAULT 0,
     order_index INTEGER DEFAULT 0,
     created_at TIMESTAMPTZ DEFAULT now()
 );
 
 -- Live classes
 CREATE TABLE public.live_classes (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
     title TEXT NOT NULL,
     description TEXT,
     scheduled_at TIMESTAMPTZ NOT NULL,
     duration_minutes INTEGER DEFAULT 60,
     meeting_url TEXT,
     status TEXT DEFAULT 'scheduled',
     created_at TIMESTAMPTZ DEFAULT now()
 );
 
 -- Mock papers
 CREATE TABLE public.mock_papers (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     description TEXT,
     topic TEXT,
     total_marks INTEGER DEFAULT 100,
     duration_minutes INTEGER DEFAULT 60,
     questions JSONB DEFAULT '[]'::jsonb,
     is_published BOOLEAN DEFAULT false,
     created_at TIMESTAMPTZ DEFAULT now()
 );
 
 -- Mock paper attempts
 CREATE TABLE public.mock_paper_attempts (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
     mock_paper_id UUID REFERENCES public.mock_papers(id) ON DELETE CASCADE NOT NULL,
     score INTEGER DEFAULT 0,
     total_marks INTEGER DEFAULT 100,
     answers JSONB DEFAULT '{}'::jsonb,
     started_at TIMESTAMPTZ DEFAULT now(),
     submitted_at TIMESTAMPTZ,
     status TEXT DEFAULT 'in_progress'
 );
 
 -- Live exams (time-bound secure exams)
 CREATE TABLE public.live_exams (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     description TEXT,
     start_time TIMESTAMPTZ NOT NULL,
     end_time TIMESTAMPTZ NOT NULL,
     duration_minutes INTEGER DEFAULT 60,
     total_marks INTEGER DEFAULT 100,
     questions JSONB DEFAULT '[]'::jsonb,
     is_published BOOLEAN DEFAULT false,
     created_at TIMESTAMPTZ DEFAULT now()
 );
 
 -- Live exam attempts
 CREATE TABLE public.live_exam_attempts (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
     live_exam_id UUID REFERENCES public.live_exams(id) ON DELETE CASCADE NOT NULL,
     score INTEGER DEFAULT 0,
     total_marks INTEGER DEFAULT 100,
     answers JSONB DEFAULT '{}'::jsonb,
     started_at TIMESTAMPTZ DEFAULT now(),
     submitted_at TIMESTAMPTZ,
     status TEXT DEFAULT 'in_progress',
     attempt_number INTEGER DEFAULT 1
 );
 
 -- Leaderboard stats
 CREATE TABLE public.leaderboard_stats (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
     total_score INTEGER DEFAULT 0,
     exams_completed INTEGER DEFAULT 0,
     average_percentage DECIMAL(5,2) DEFAULT 0,
     rank INTEGER,
     updated_at TIMESTAMPTZ DEFAULT now()
 );
 
 -- Notifications
 CREATE TABLE public.notifications (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
     title TEXT NOT NULL,
     message TEXT,
     type TEXT DEFAULT 'info',
     is_read BOOLEAN DEFAULT false,
     created_at TIMESTAMPTZ DEFAULT now()
 );
 
 -- =====================
 -- HELPER FUNCTIONS
 -- =====================
 
 -- Check if user has a specific role
 CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
 RETURNS BOOLEAN
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET search_path = public
 AS $$
   SELECT EXISTS (
     SELECT 1
     FROM public.user_roles
     WHERE user_id = _user_id
       AND role = _role
   )
 $$;
 
 -- Check if user is enrolled in a course
 CREATE OR REPLACE FUNCTION public.is_enrolled(_user_id UUID, _course_id UUID)
 RETURNS BOOLEAN
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET search_path = public
 AS $$
   SELECT EXISTS (
     SELECT 1
     FROM public.course_enrollments
     WHERE user_id = _user_id
       AND course_id = _course_id
       AND status = 'active'
   )
 $$;
 
 -- =====================
 -- ENABLE RLS
 -- =====================
 
 ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.mock_papers ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.mock_paper_attempts ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.live_exams ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.live_exam_attempts ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.leaderboard_stats ENABLE ROW LEVEL SECURITY;
 ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
 
 -- =====================
 -- RLS POLICIES
 -- =====================
 
 -- Profiles: Users can only access their own profile
 CREATE POLICY "Users can view own profile" ON public.profiles
     FOR SELECT USING (auth.uid() = user_id);
 
 CREATE POLICY "Users can update own profile" ON public.profiles
     FOR UPDATE USING (auth.uid() = user_id);
 
 CREATE POLICY "Users can insert own profile" ON public.profiles
     FOR INSERT WITH CHECK (auth.uid() = user_id);
 
 -- User roles: Users can view their own roles
 CREATE POLICY "Users can view own roles" ON public.user_roles
     FOR SELECT USING (auth.uid() = user_id);
 
 -- Courses: All authenticated users can view published courses
 CREATE POLICY "Anyone can view published courses" ON public.courses
     FOR SELECT USING (is_published = true);
 
 -- Course enrollments: Users can view and manage their own enrollments
 CREATE POLICY "Users can view own enrollments" ON public.course_enrollments
     FOR SELECT USING (auth.uid() = user_id);
 
 CREATE POLICY "Users can enroll themselves" ON public.course_enrollments
     FOR INSERT WITH CHECK (auth.uid() = user_id);
 
 -- Videos: Users can view videos for courses they're enrolled in
 CREATE POLICY "Enrolled users can view videos" ON public.videos
     FOR SELECT USING (public.is_enrolled(auth.uid(), course_id));
 
 -- Live classes: Users can view live classes for enrolled courses
 CREATE POLICY "Enrolled users can view live classes" ON public.live_classes
     FOR SELECT USING (public.is_enrolled(auth.uid(), course_id));
 
 -- Mock papers: Users can view mock papers for enrolled courses
 CREATE POLICY "Enrolled users can view mock papers" ON public.mock_papers
     FOR SELECT USING (
         course_id IS NULL OR public.is_enrolled(auth.uid(), course_id)
     );
 
 -- Mock paper attempts: Users can manage their own attempts
 CREATE POLICY "Users can view own mock attempts" ON public.mock_paper_attempts
     FOR SELECT USING (auth.uid() = user_id);
 
 CREATE POLICY "Users can create mock attempts" ON public.mock_paper_attempts
     FOR INSERT WITH CHECK (auth.uid() = user_id);
 
 CREATE POLICY "Users can update own mock attempts" ON public.mock_paper_attempts
     FOR UPDATE USING (auth.uid() = user_id);
 
 -- Live exams: Users can view exams for enrolled courses
 CREATE POLICY "Enrolled users can view live exams" ON public.live_exams
     FOR SELECT USING (
         course_id IS NULL OR public.is_enrolled(auth.uid(), course_id)
     );
 
 -- Live exam attempts: Users can manage their own attempts
 CREATE POLICY "Users can view own exam attempts" ON public.live_exam_attempts
     FOR SELECT USING (auth.uid() = user_id);
 
 CREATE POLICY "Users can create exam attempts" ON public.live_exam_attempts
     FOR INSERT WITH CHECK (auth.uid() = user_id);
 
 CREATE POLICY "Users can update own exam attempts" ON public.live_exam_attempts
     FOR UPDATE USING (auth.uid() = user_id);
 
 -- Leaderboard: Public read access
 CREATE POLICY "Anyone can view leaderboard" ON public.leaderboard_stats
     FOR SELECT USING (true);
 
 -- Notifications: Users can only see their own notifications
 CREATE POLICY "Users can view own notifications" ON public.notifications
     FOR SELECT USING (auth.uid() = user_id);
 
 CREATE POLICY "Users can update own notifications" ON public.notifications
     FOR UPDATE USING (auth.uid() = user_id);
 
 -- =====================
 -- TRIGGERS
 -- =====================
 
 -- Auto-create profile and assign student role on signup
 CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS TRIGGER
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
 AS $$
 BEGIN
     -- Create profile
     INSERT INTO public.profiles (user_id, email, full_name)
     VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
     
     -- Assign student role
     INSERT INTO public.user_roles (user_id, role)
     VALUES (NEW.id, 'student');
     
     -- Initialize leaderboard stats
     INSERT INTO public.leaderboard_stats (user_id)
     VALUES (NEW.id);
     
     RETURN NEW;
 END;
 $$;
 
 CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();