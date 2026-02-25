import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Upload,
  Briefcase,
  GraduationCap,
  Check,
  X,
  ArrowLeft,
  Trophy,
} from "lucide-react";
import AmbientBackground from "@/components/ui/AmbientBackground";

const instructorSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(100, { message: "Name must be less than 100 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
    areaOfExpertise: z
      .string()
      .min(1, { message: "Please select your area of expertise" }),
    customExpertise: z.string().optional(),
    experience: z
      .string()
      .min(1, { message: "Please select your experience level" }),
    resume: z.any().optional(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms & Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.areaOfExpertise === "Other") {
        return data.customExpertise && data.customExpertise.trim().length >= 2;
      }
      return true;
    },
    {
      message: "Please specify your area of expertise",
      path: ["customExpertise"],
    },
  );

type InstructorFormData = z.infer<typeof instructorSchema>;

const expertiseOptions = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Cloud Computing",
  "Cybersecurity",
  "DevOps",
  "UI/UX Design",
  "Database Management",
  "Software Engineering",
  "Other",
];

const experienceOptions = [
  "0-1 years",
  "1-3 years",
  "3-5 years",
  "5-10 years",
  "10+ years",
];

const getPasswordStrength = (password: string) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { checks, score };
};

export default function InstructorRegister() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<InstructorFormData>({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      areaOfExpertise: "",
      customExpertise: "",
      experience: "",
      agreeToTerms: false,
    },
  });

  const watchPassword = form.watch("password");
  const watchExpertise = form.watch("areaOfExpertise");
  const passwordStrength = getPasswordStrength(watchPassword || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Resume must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setResumeFile(file);
      form.setValue("resume", file);
    }
  };

  const handleSubmit = async (data: InstructorFormData) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("areaOfExpertise", data.areaOfExpertise);
      if (data.customExpertise)
        formData.append("customExpertise", data.customExpertise);
      formData.append("experience", data.experience);
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const res = await fetch("http://localhost:5000/api/instructor/register", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Registration failed");
      }

      toast({
        title: "Application Submitted!",
        description:
          "Please check your email to verify your account. Your instructor application is under review.",
      });

      navigate("/auth");
    } catch (error: unknown) {
      toast({
        title: "Registration Failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const PasswordRequirement = ({
    met,
    text,
  }: {
    met: boolean;
    text: string;
  }) => (
    <div
      className={`flex items-center gap-2 p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${met ? "bg-green-400 text-black px-3" : "bg-white text-black/40"}`}
    >
      {met ? (
        <Check className="h-3 w-3 stroke-[3px]" />
      ) : (
        <div className="h-1.5 w-1.5 bg-black/20 rounded-full" />
      )}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#E9E9E9] font-['Inter'] relative overflow-hidden">
      <AmbientBackground />

      {/* Left Panel - Brand Showcase */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative z-10 border-r-4 border-black">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-white p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
              <img src={logo} alt="AOTMS Logo" className="h-8 w-auto" />
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter text-black">
              AOTMS
            </span>
          </Link>
        </div>

        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FD5A1A] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white font-black uppercase tracking-widest text-xs mb-8">
            <Trophy className="h-4 w-4" />
            <span>Instructor Program</span>
          </div>
          <h1 className="text-6xl xl:text-7xl font-black text-black leading-none uppercase tracking-tighter mb-8 italic">
            Empower the <br />
            <span className="text-[#0075CF] not-italic">Next Gen</span> <br />
            of <span className="text-[#FD5A1A]">Tech.</span>
          </h1>
          <p className="text-xl font-bold text-black/60 uppercase tracking-widest leading-relaxed mb-12">
            Join 500+ expert mentors shaping the future of global technology
            education.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-3xl font-black text-black mb-1">98%</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-black/40">
                Student Satisfaction
              </p>
            </div>
            <div className="bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-3xl font-black text-black mb-1">$2M+</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-black/40">
                Instructor Earnings
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 border-t-4 border-black pt-12">
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-12 w-12 rounded-none border-2 border-black bg-[#E9E9E9] flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
              >
                <img
                  src={`https://i.pravatar.cc/150?u=${i + 20}`}
                  alt="Instructor"
                  className="grayscale hover:grayscale-0 transition-all"
                />
              </div>
            ))}
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-black/40">
            Trusted by industry <br /> leaders worldwide
          </p>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 p-4 sm:p-8 lg:p-12 flex items-center justify-center relative z-20 overflow-y-auto">
        <div className="w-full max-w-2xl bg-white border-4 border-black p-8 sm:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 border-b-4 border-black pb-8">
            <div>
              <h2 className="text-4xl font-black text-black uppercase tracking-tight mb-2 italic">
                Apply Now.
              </h2>
              <p className="text-sm font-bold text-black/50 uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Become an instructor
              </p>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-black">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black z-10" />
                          <Input
                            placeholder="John Doe"
                            className="h-14 pl-12 bg-[#E9E9E9] border-4 border-black text-black font-bold focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[#FD5A1A] font-black uppercase text-[10px] italic" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-black">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black z-10" />
                          <Input
                            type="email"
                            placeholder="instructor@example.com"
                            className="h-14 pl-12 bg-[#E9E9E9] border-4 border-black text-black font-bold focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[#FD5A1A] font-black uppercase text-[10px] italic" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 2: Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-black">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black z-10" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="h-14 pl-12 pr-12 bg-[#E9E9E9] border-4 border-black text-black font-bold focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:scale-110 transition-transform z-10"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[#FD5A1A] font-black uppercase text-[10px] italic" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-black">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black z-10" />
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            className="h-14 pl-12 pr-12 bg-[#E9E9E9] border-4 border-black text-black font-bold focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:scale-110 transition-transform z-10"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[#FD5A1A] font-black uppercase text-[10px] italic" />
                    </FormItem>
                  )}
                />
              </div>

              {watchPassword && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-[#E9E9E9] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <PasswordRequirement
                    met={passwordStrength.checks.length}
                    text="8+ characters"
                  />
                  <PasswordRequirement
                    met={passwordStrength.checks.uppercase}
                    text="Uppercase letter"
                  />
                  <PasswordRequirement
                    met={passwordStrength.checks.lowercase}
                    text="Lowercase letter"
                  />
                  <PasswordRequirement
                    met={passwordStrength.checks.number}
                    text="Number"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="areaOfExpertise"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-black">
                        Area of Expertise
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-14 bg-[#E9E9E9] border-4 border-black text-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
                            <SelectValue placeholder="Select expertise" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
                          {expertiseOptions.map((option) => (
                            <SelectItem
                              key={option}
                              value={option}
                              className="font-black uppercase tracking-widest text-[10px] hover:bg-[#E9E9E9] focus:bg-[#E9E9E9]"
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[#FD5A1A] font-black uppercase text-[10px] italic" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-black">
                        Experience
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-14 bg-[#E9E9E9] border-4 border-black text-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
                          {experienceOptions.map((option) => (
                            <SelectItem
                              key={option}
                              value={option}
                              className="font-black uppercase tracking-widest text-[10px] hover:bg-[#E9E9E9] focus:bg-[#E9E9E9]"
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[#FD5A1A] font-black uppercase text-[10px] italic" />
                    </FormItem>
                  )}
                />
              </div>

              {watchExpertise === "Other" && (
                <FormField
                  control={form.control}
                  name="customExpertise"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-black">
                        Specify Expertise
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Blockchain Development"
                          className="h-14 bg-[#E9E9E9] border-4 border-black text-black font-bold focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[#FD5A1A] font-black uppercase text-[10px] italic" />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="resume"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-black">
                      Resume / CV
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        <div className="flex items-center gap-4 h-14 px-6 bg-[#E9E9E9] border-4 border-dashed border-black/40 group-hover:bg-[#E9E9E9]/50 group-hover:border-black transition-all rounded-none">
                          <Upload className="h-5 w-5 text-black/60 group-hover:text-black" />
                          <span className="text-sm font-black uppercase tracking-widest text-black/40 group-hover:text-black">
                            {resumeFile ? resumeFile.name : "Upload Document"}
                          </span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-[#FD5A1A] font-black uppercase text-[10px] italic" />
                  </FormItem>
                )}
              />

              {/* Terms & Conditions */}
              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 bg-[#E9E9E9]/50 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-5 w-5 border-2 border-black data-[state=checked]:bg-black"
                      />
                    </FormControl>
                    <div className="leading-tight">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-black cursor-pointer">
                        I agree to the{" "}
                        <button
                          type="button"
                          onClick={() => setShowTermsDialog(true)}
                          className="text-[#0075CF] underline"
                        >
                          Terms
                        </button>{" "}
                        &{" "}
                        <button
                          type="button"
                          onClick={() => setShowPrivacyDialog(true)}
                          className="text-[#0075CF] underline"
                        >
                          Privacy
                        </button>
                      </FormLabel>
                      <FormMessage className="text-[#FD5A1A] font-black uppercase text-[8px] italic mt-1" />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-[#0075CF] text-white border-4 border-black font-black uppercase tracking-[0.2em] text-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all disabled:opacity-50"
              >
                {loading ? "Processing..." : "Submit Application"}
              </Button>

              <div className="text-center pt-4">
                <Link
                  to="/auth"
                  className="text-xs font-black uppercase tracking-widest text-black hover:text-[#0075CF] transition-colors"
                >
                  Already registered? Sign in
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Dialogs - Neobrutalist Style */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none p-8">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black uppercase tracking-tighter italic">
              Terms of Service
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] mt-6 mt-6 pr-4 border-t-2 border-black pt-6">
            <div className="space-y-6 font-bold text-black/60 uppercase tracking-widest text-xs leading-loose">
              <section>
                <h3 className="font-black text-black text-sm mb-2">
                  1. Instructor Agreement
                </h3>
                <p>
                  Registering as an instructor requires accurate and truthful
                  information about qualifications and experience.
                </p>
              </section>
              <section>
                <h3 className="font-black text-black text-sm mb-2">
                  2. Content Guidelines
                </h3>
                <p>
                  All course content must be original or properly licensed.
                  AOTMS retains non-exclusive distribution rights.
                </p>
              </section>
              <section>
                <h3 className="font-black text-black text-sm mb-2">
                  3. Quality Standards
                </h3>
                <p>
                  Maintain high standards in audio, video, and responsiveness.
                  We review all content regularly.
                </p>
              </section>
              <section>
                <h3 className="font-black text-black text-sm mb-2">
                  4. Payment Terms
                </h3>
                <p>
                  Earnings are calculated based on enrollments and completions.
                  Monthly payouts apply.
                </p>
              </section>
            </div>
          </ScrollArea>
          <div className="mt-8 flex justify-end">
            <Button
              onClick={() => setShowTermsDialog(false)}
              className="bg-black text-white px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase tracking-widest text-xs hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              I Understand
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none p-8">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black uppercase tracking-tighter italic">
              Privacy Policy
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] mt-6 mt-6 pr-4 border-t-2 border-black pt-6">
            <div className="space-y-6 font-bold text-black/60 uppercase tracking-widest text-xs leading-loose">
              <section>
                <h3 className="font-black text-black text-sm mb-2">
                  1. Information Collection
                </h3>
                <p>
                  We collect name, email, qualifications, and resume to process
                  your application securely.
                </p>
              </section>
              <section>
                <h3 className="font-black text-black text-sm mb-2">
                  2. Data Usage
                </h3>
                <p>
                  Information is used for verification, communication, and
                  processing payouts.
                </p>
              </section>
              <section>
                <h3 className="font-black text-black text-sm mb-2">
                  3. Security
                </h3>
                <p>
                  We implement industry-standard encryption. Your data is
                  protected by multiple layers of security.
                </p>
              </section>
            </div>
          </ScrollArea>
          <div className="mt-8 flex justify-end">
            <Button
              onClick={() => setShowPrivacyDialog(false)}
              className="bg-black text-white px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase tracking-widest text-xs hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              I Understand
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
