import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import TargetCursor from "@/components/ui/TargetCursor";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import LearningPaths from "./pages/LearningPaths";
import InstructorRegister from "./pages/InstructorRegister";
import Dashboard from "./pages/Dashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import CoursePlayer from "./pages/CoursePlayer";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Assignments from "./pages/Assignments";
import Courses from "./pages/Courses";
import ExamPage from "./pages/ExamPage";
import ScrollToTop from "@/components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <TargetCursor
          spinDuration={2}
          hideDefaultCursor
          parallaxOn
          hoverDuration={0.2}
        />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:courseId/play" element={<CoursePlayer />} />
            <Route path="/exam" element={<ExamPage />} />
            <Route path="/become-instructor" element={<InstructorRegister />} />
            <Route path="/learning-paths" element={<LearningPaths />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route path="/instructor/*" element={<InstructorDashboard />} />
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/manager/*" element={<ManagerDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
