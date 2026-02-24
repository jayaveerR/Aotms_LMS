import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  BookOpen,
  Clock,
  Users,
  Star,
  Zap,
  ChevronRight,
  X,
  CheckCircle,
  Lock,
  Layers,
  Code,
  Database,
  Cpu,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCourses, useEnrollments, Course } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

/* ── Category icon map ────────────────────────────── */
const categoryIcons: Record<string, React.ElementType> = {
  "Web Development": Code,
  "Data Science": Database,
  "Cloud Computing": Cpu,
  "Digital Marketing": TrendingUp,
  Cybersecurity: Shield,
  Design: Layers,
  default: BookOpen,
};

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"] as const;
const CATEGORIES = [
  "All",
  "Web Development",
  "Data Science",
  "Cloud Computing",
  "Digital Marketing",
  "Cybersecurity",
  "Design",
];

/* ── Course Detail Modal ──────────────────────────── */
function CourseModal({
  course,
  onClose,
  onEnroll,
  isEnrolled,
  enrolling,
}: {
  course: Course;
  onClose: () => void;
  onEnroll: (id: string) => void;
  isEnrolled: boolean;
  enrolling: boolean;
}) {
  const Icon = categoryIcons[course.category ?? ""] ?? BookOpen;
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#000000]/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative z-10 w-full max-w-2xl bg-white border-2 border-[#000000] rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 20 }}
        >
          {/* Header stripe */}
          <div className="h-2 bg-[#0075CF]" />

          <div className="p-6 sm:p-8">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center border-2 border-[#000000] rounded-lg hover:bg-[#E9E9E9] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon + Category */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-xl bg-[#0075CF] border-2 border-[#000000] flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#0075CF]">
                  {course.category ?? "Course"}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded border-2 border-[#000000] ${
                      course.level === "Beginner"
                        ? "bg-[#E9E9E9] text-[#000000]"
                        : course.level === "Intermediate"
                          ? "bg-[#0075CF] text-white"
                          : "bg-[#FD5A1A] text-white"
                    }`}
                  >
                    {course.level ?? "All Levels"}
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-black text-[#000000] mb-3 leading-tight">
              {course.title}
            </h2>
            <p className="text-[#000000]/70 text-sm leading-relaxed mb-6">
              {course.description ?? "No description available."}
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                {
                  icon: Clock,
                  label: "Duration",
                  value: course.duration_hours
                    ? `${course.duration_hours}h`
                    : "Self-paced",
                },
                {
                  icon: BookOpen,
                  label: "Lessons",
                  value: course.total_lessons ?? "—",
                },
                {
                  icon: Users,
                  label: "Students",
                  value: course.enrollment_count ?? "—",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center justify-center p-3 bg-[#E9E9E9] border-2 border-[#000000] rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <s.icon className="w-5 h-5 text-[#0075CF] mb-1" />
                  <span className="text-lg font-black text-[#000000]">
                    {s.value}
                  </span>
                  <span className="text-xs text-[#000000]/60">{s.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            {isEnrolled ? (
              <div className="flex items-center gap-3 p-4 bg-[#E9E9E9] border-2 border-[#000000] rounded-xl">
                <CheckCircle className="w-6 h-6 text-[#0075CF] shrink-0" />
                <div>
                  <p className="font-black text-[#000000]">You're enrolled!</p>
                  <p className="text-xs text-[#000000]/60">
                    Go to your dashboard to continue learning.
                  </p>
                </div>
              </div>
            ) : (
              <Button
                variant="accent"
                size="lg"
                className="w-full text-base"
                onClick={() => onEnroll(course.id)}
                disabled={enrolling}
              >
                {enrolling ? (
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 animate-spin" /> Enrolling…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Enroll For Free
                  </span>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Course Card ─────────────────────────────────── */
function CourseCard({
  course,
  isEnrolled,
  onClick,
}: {
  course: Course;
  isEnrolled: boolean;
  onClick: () => void;
}) {
  const Icon = categoryIcons[course.category ?? ""] ?? BookOpen;
  const levelColor =
    course.level === "Beginner"
      ? "bg-[#E9E9E9] text-[#000000]"
      : course.level === "Intermediate"
        ? "bg-[#0075CF] text-white"
        : "bg-[#FD5A1A] text-white";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, x: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="bg-white border-2 border-[#000000] rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(0,117,207,1)] transition-shadow duration-200">
        {/* Thumbnail */}
        <div className="h-44 bg-[#E9E9E9] flex items-center justify-center relative border-b-2 border-[#000000]">
          <Icon className="w-16 h-16 text-[#0075CF]/40" />
          {/* Category chip */}
          <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest bg-[#000000] text-white px-3 py-1 rounded-full">
            {course.category ?? "Course"}
          </span>
          {/* Enrolled badge */}
          {isEnrolled && (
            <span className="absolute top-3 right-3 flex items-center gap-1 bg-[#0075CF] text-white text-[10px] font-black uppercase px-2 py-1 rounded-full border border-white">
              <CheckCircle className="w-3 h-3" /> Enrolled
            </span>
          )}
          {/* Level badge */}
          <span
            className={`absolute bottom-3 right-3 text-[10px] font-black px-2.5 py-1 rounded border-2 border-[#000000] ${levelColor}`}
          >
            {course.level ?? "All Levels"}
          </span>
        </div>

        {/* Body */}
        <div className="p-5">
          <h3 className="font-black text-[#000000] text-base leading-tight mb-2 line-clamp-2 group-hover:text-[#0075CF] transition-colors">
            {course.title}
          </h3>
          <p className="text-xs text-[#000000]/60 leading-relaxed line-clamp-2 mb-4">
            {course.description ?? "No description provided."}
          </p>

          {/* Footer row */}
          <div className="flex items-center justify-between pt-3 border-t-2 border-[#E9E9E9]">
            <div className="flex items-center gap-3 text-xs text-[#000000]/60">
              {course.duration_hours && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {course.duration_hours}h
                </span>
              )}
              {course.total_lessons && (
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {course.total_lessons} lessons
                </span>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-[#0075CF] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Skeleton Card ───────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white border-2 border-[#E9E9E9] rounded-2xl overflow-hidden animate-pulse">
      <div className="h-44 bg-[#E9E9E9]" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-[#E9E9E9] rounded w-3/4" />
        <div className="h-3 bg-[#E9E9E9] rounded w-full" />
        <div className="h-3 bg-[#E9E9E9] rounded w-2/3" />
        <div className="h-8 bg-[#E9E9E9] rounded-xl w-full mt-2" />
      </div>
    </div>
  );
}

/* ── Empty State ─────────────────────────────────── */
function EmptyState({ query }: { query: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 border-2 border-[#000000] rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#E9E9E9] flex items-center justify-center mb-5">
        <Lock className="w-10 h-10 text-[#000000]/40" />
      </div>
      <h3 className="font-black text-xl text-[#000000] mb-2">
        No courses found
      </h3>
      <p className="text-sm text-[#000000]/60 max-w-xs">
        {query
          ? `No results for "${query}". Try a different keyword or filter.`
          : "No courses available right now. Check back later!"}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN: Courses Browse Page
══════════════════════════════════════════════════ */
export default function CoursesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { courses, loading: coursesLoading } = useCourses();
  const {
    enrollments,
    enrolling,
    enroll,
    isEnrolled,
    loading: enrollLoading,
  } = useEnrollments();

  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] =
    useState<(typeof LEVELS)[number]>("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase());
      const matchLevel = selectedLevel === "All" || c.level === selectedLevel;
      const matchCat =
        selectedCategory === "All" || c.category === selectedCategory;
      return matchSearch && matchLevel && matchCat;
    });
  }, [courses, search, selectedLevel, selectedCategory]);

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    const result = await enroll(courseId);
    toast({
      title: result.success ? "🎉 Enrolled!" : "❌ Error",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
    if (result.success) setActiveCourse(null);
  };

  const isLoading = coursesLoading || enrollLoading;

  return (
    <div className="min-h-screen bg-[#E9E9E9]">
      {/* ── Page Header ── */}
      <div className="bg-[#000000] border-b-4 border-[#FD5A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#FD5A1A] rounded-full text-[#FD5A1A] text-xs font-black uppercase tracking-widest mb-5 shadow-[3px_3px_0px_0px_rgba(253,90,26,1)]">
              <Star className="w-4 h-4" /> Browse Courses
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight mb-4">
              FIND YOUR
              <br />
              <span className="text-[#FD5A1A]">NEXT SKILL</span>
            </h1>
            <p className="text-white/60 text-sm sm:text-base max-w-xl">
              {enrollments.length > 0
                ? `You're enrolled in ${enrollments.length} course${enrollments.length > 1 ? "s" : ""}. Keep learning!`
                : "Explore our library of expert-led courses and start building real-world skills today."}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div className="sticky top-0 z-30 bg-white border-b-2 border-[#000000] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#000000]/40" />
            <input
              type="text"
              placeholder="Search courses…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#E9E9E9] border-2 border-[#000000] rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0075CF] focus:border-[#0075CF] transition-all placeholder:text-[#000000]/40"
            />
          </div>

          {/* Level filter */}
          <div className="flex gap-2 flex-wrap">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLevel(l)}
                className={`text-xs font-black px-4 py-2 border-2 border-[#000000] rounded-full transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] ${
                  selectedLevel === l
                    ? "bg-[#0075CF] text-white"
                    : "bg-white text-[#000000] hover:bg-[#E9E9E9]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Category row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-3 flex gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap text-xs font-black px-4 py-1.5 border-2 border-[#000000] rounded-full transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] ${
                selectedCategory === cat
                  ? "bg-[#FD5A1A] text-white"
                  : "bg-white text-[#000000] hover:bg-[#E9E9E9]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results Count ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-[#000000]/60">
          {isLoading
            ? "Loading…"
            : `${filtered.length} course${filtered.length !== 1 ? "s" : ""} found`}
        </p>
        {user && enrollments.length > 0 && (
          <button
            onClick={() => navigate("/dashboard/courses")}
            className="text-xs font-black text-[#0075CF] flex items-center gap-1 hover:underline underline-offset-2"
          >
            My Courses <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <EmptyState query={search} />
          ) : (
            filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={isEnrolled(course.id)}
                onClick={() => setActiveCourse(course)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {activeCourse && (
        <CourseModal
          course={activeCourse}
          onClose={() => setActiveCourse(null)}
          onEnroll={handleEnroll}
          isEnrolled={isEnrolled(activeCourse.id)}
          enrolling={enrolling === activeCourse.id}
        />
      )}
    </div>
  );
}
