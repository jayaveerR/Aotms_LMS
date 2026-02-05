-- Create exams table for scheduling exams
CREATE TABLE public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    exam_type TEXT NOT NULL CHECK (exam_type IN ('live', 'mock', 'practice')),
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    total_marks INTEGER NOT NULL DEFAULT 100,
    passing_marks INTEGER DEFAULT 40,
    negative_marking DECIMAL(3,2) DEFAULT 0,
    max_attempts INTEGER DEFAULT 1,
    shuffle_questions BOOLEAN DEFAULT true,
    show_results BOOLEAN DEFAULT true,
    proctoring_enabled BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create question_bank table
CREATE TABLE public.question_bank (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic TEXT NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('mcq', 'true_false', 'short', 'long')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    options JSONB,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    marks INTEGER DEFAULT 1,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create exam_questions junction table
CREATE TABLE public.exam_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.question_bank(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 0,
    marks INTEGER DEFAULT 1,
    UNIQUE(exam_id, question_id)
);

-- Create student_exam_results table
CREATE TABLE public.student_exam_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    score INTEGER DEFAULT 0,
    total_marks INTEGER NOT NULL,
    percentage DECIMAL(5,2) DEFAULT 0,
    time_taken_seconds INTEGER DEFAULT 0,
    answers JSONB,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create leaderboard table (aggregated scores)
CREATE TABLE public.leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL UNIQUE,
    student_name TEXT NOT NULL,
    total_score INTEGER DEFAULT 0,
    exams_completed INTEGER DEFAULT 0,
    average_percentage DECIMAL(5,2) DEFAULT 0,
    rank INTEGER,
    badges JSONB DEFAULT '[]',
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID,
    verified_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create guest_credentials table
CREATE TABLE public.guest_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL,
    access_level TEXT NOT NULL CHECK (access_level IN ('demo', 'view_only', 'limited', 'full')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    max_sessions INTEGER DEFAULT 1,
    allowed_courses UUID[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create mock_test_configs table
CREATE TABLE public.mock_test_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    topics TEXT[] NOT NULL DEFAULT '{}',
    question_count INTEGER NOT NULL DEFAULT 30,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    difficulty_mix JSONB DEFAULT '{"easy": 30, "medium": 50, "hard": 20}',
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_test_configs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for exams
CREATE POLICY "Managers can manage exams"
ON public.exams FOR ALL
USING (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Students can view scheduled/active exams"
ON public.exams FOR SELECT
USING (status IN ('scheduled', 'active'));

-- RLS Policies for question_bank
CREATE POLICY "Managers can manage questions"
ON public.question_bank FOR ALL
USING (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Instructors can add questions"
ON public.question_bank FOR INSERT
WITH CHECK (has_role(auth.uid(), 'instructor'::app_role));

-- RLS Policies for exam_questions
CREATE POLICY "Managers can manage exam questions"
ON public.exam_questions FOR ALL
USING (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for student_exam_results
CREATE POLICY "Students can view own results"
ON public.student_exam_results FOR SELECT
USING (student_id = auth.uid());

CREATE POLICY "Students can insert own results"
ON public.student_exam_results FOR INSERT
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Managers can view all results"
ON public.student_exam_results FOR SELECT
USING (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for leaderboard
CREATE POLICY "Everyone can view leaderboard"
ON public.leaderboard FOR SELECT
USING (true);

CREATE POLICY "Managers can manage leaderboard"
ON public.leaderboard FOR ALL
USING (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for guest_credentials
CREATE POLICY "Managers can manage guest credentials"
ON public.guest_credentials FOR ALL
USING (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for mock_test_configs
CREATE POLICY "Managers can manage mock tests"
ON public.mock_test_configs FOR ALL
USING (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Students can view active mock tests"
ON public.mock_test_configs FOR SELECT
USING (is_active = true);