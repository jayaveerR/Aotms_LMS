-- Create course_topics table for tracking topic completion
CREATE TABLE public.course_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create course_videos table for video content
CREATE TABLE public.course_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.course_topics(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration_seconds INTEGER DEFAULT 0,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create course_resources table for notes, PPTs, assignments
CREATE TABLE public.course_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.course_topics(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('note', 'ppt', 'pdf', 'assignment', 'other')),
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT DEFAULT 0,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create course_timeline table for milestones and deadlines
CREATE TABLE public.course_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    milestone_type TEXT NOT NULL CHECK (milestone_type IN ('start', 'module', 'assignment', 'exam', 'live_class', 'end')),
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create course_announcements table
CREATE TABLE public.course_announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.course_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_topics
CREATE POLICY "Instructors can manage topics for their courses"
ON public.course_topics FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.courses 
        WHERE courses.id = course_topics.course_id 
        AND courses.instructor_id = auth.uid()
    )
);

CREATE POLICY "Students can view topics of enrolled courses"
ON public.course_topics FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.courses 
        WHERE courses.id = course_topics.course_id 
        AND courses.status = 'approved'
    )
);

-- RLS Policies for course_videos
CREATE POLICY "Instructors can manage videos for their courses"
ON public.course_videos FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.courses 
        WHERE courses.id = course_videos.course_id 
        AND courses.instructor_id = auth.uid()
    )
);

CREATE POLICY "Students can view published videos"
ON public.course_videos FOR SELECT
USING (
    is_published = true AND EXISTS (
        SELECT 1 FROM public.courses 
        WHERE courses.id = course_videos.course_id 
        AND courses.status = 'approved'
    )
);

-- RLS Policies for course_resources
CREATE POLICY "Instructors can manage resources for their courses"
ON public.course_resources FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.courses 
        WHERE courses.id = course_resources.course_id 
        AND courses.instructor_id = auth.uid()
    )
);

CREATE POLICY "Students can view resources of approved courses"
ON public.course_resources FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.courses 
        WHERE courses.id = course_resources.course_id 
        AND courses.status = 'approved'
    )
);

-- RLS Policies for course_timeline
CREATE POLICY "Instructors can manage timeline for their courses"
ON public.course_timeline FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.courses 
        WHERE courses.id = course_timeline.course_id 
        AND courses.instructor_id = auth.uid()
    )
);

CREATE POLICY "Students can view timeline of approved courses"
ON public.course_timeline FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.courses 
        WHERE courses.id = course_timeline.course_id 
        AND courses.status = 'approved'
    )
);

-- RLS Policies for course_announcements
CREATE POLICY "Instructors can manage announcements for their courses"
ON public.course_announcements FOR ALL
USING (
    instructor_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.courses 
        WHERE courses.id = course_announcements.course_id 
        AND courses.instructor_id = auth.uid()
    )
);

CREATE POLICY "Students can view announcements of approved courses"
ON public.course_announcements FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.courses 
        WHERE courses.id = course_announcements.course_id 
        AND courses.status = 'approved'
    )
);

-- Create storage buckets for course content
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES 
    ('course-videos', 'course-videos', true, 524288000),
    ('course-resources', 'course-resources', true, 52428800)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for course-videos bucket
CREATE POLICY "Instructors can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'course-videos' AND
    has_role(auth.uid(), 'instructor'::app_role)
);

CREATE POLICY "Anyone can view course videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-videos');

CREATE POLICY "Instructors can update their videos"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'course-videos' AND
    has_role(auth.uid(), 'instructor'::app_role)
);

CREATE POLICY "Instructors can delete their videos"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'course-videos' AND
    has_role(auth.uid(), 'instructor'::app_role)
);

-- Storage policies for course-resources bucket
CREATE POLICY "Instructors can upload resources"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'course-resources' AND
    has_role(auth.uid(), 'instructor'::app_role)
);

CREATE POLICY "Anyone can view course resources"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-resources');

CREATE POLICY "Instructors can update their resources"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'course-resources' AND
    has_role(auth.uid(), 'instructor'::app_role)
);

CREATE POLICY "Instructors can delete their resources"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'course-resources' AND
    has_role(auth.uid(), 'instructor'::app_role)
);