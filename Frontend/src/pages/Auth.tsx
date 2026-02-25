import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Check,
  X,
  Trophy,
  ArrowRight,
} from "lucide-react";
import AmbientBackground from "@/components/ui/AmbientBackground";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  countryCode: z.string().default("+91"),
  password: z.string().min(1, { message: "Password is required" }),
});

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(50, { message: "Name must be less than 50 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().optional(),
    countryCode: z.string().default("+91"),
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
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms & Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

// Password strength checker
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

export default function Auth() {
  const location = useLocation();
  const initialMode = location.state?.mode === "login";
  const [isLogin, setIsLogin] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginConfirmPassword, setShowLoginConfirmPassword] =
    useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", phone: "", countryCode: "+91", password: "" },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      countryCode: "+91",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const watchPassword = registerForm.watch("password");
  const passwordStrength = useMemo(
    () => getPasswordStrength(watchPassword || ""),
    [watchPassword],
  );

  const handleGoogleSignIn = async () => {
    toast({
      title: "Google Sign In",
      description:
        "Google authentication is currently disabled in backend-mode.",
      variant: "default",
    });
    // Implementation would require backend OAuth flow
  };

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    const { error } = await signIn(data.email, data.password);

    if (error) {
      setLoading(false);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Welcome back!" });
      setLoading(false);
      // specific redirection is handled by Dashboard component or could be returned by signIn
      navigate("/dashboard");
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setLoading(true);
    const fullPhone = data.phone
      ? `${data.countryCode}${data.phone}`
      : undefined;
    const { error } = await signUp(data.email, data.password, data.fullName);
    setLoading(false);
    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    loginForm.reset();
    registerForm.reset();
  };

  useEffect(() => {
    if (location.state?.mode) {
      setIsLogin(location.state.mode === "login");
    }
  }, [location.state]);

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
        <div className="space-y-12">
          <Link
            to="/"
            className="inline-block bg-white p-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <img src={logo} alt="AOTMS Logo" className="h-10 w-auto" />
          </Link>

          <div className="bg-white border-4 border-black p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
              <span className="text-8xl font-black">✦</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-black text-black leading-[1.1] uppercase tracking-tighter relative z-10">
              Empowering Your <br />
              <span className="text-[#0075CF] bg-[#E9E9E9] px-2 border-2 border-black inline-block mt-2">
                Career Journey
              </span>{" "}
              <br />
              with Industry Expertise.
            </h1>
            <p className="text-black/70 text-lg font-bold mt-8 uppercase tracking-wider leading-relaxed max-w-lg relative z-10">
              Join thousands of students who are already learning the skills
              that matter. Access real-world projects, expert mentorship, and
              career support all in one place.
            </p>
          </div>
        </div>

        <div className="bg-[#FD5A1A] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white transform rotate-1 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 w-12 rounded bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                >
                  <img
                    src={`https://i.pravatar.cc/150?u=${i}`}
                    alt="user"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div>
              <p className="text-white text-lg font-black uppercase tracking-tighter">
                5,000+ Graduates
              </p>
              <p className="text-white/80 text-[10px] font-black uppercase tracking-widest mt-0.5">
                Join our elite community
              </p>
            </div>
          </div>
          <div className="h-12 w-12 bg-white rounded border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Trophy className="h-6 w-6 text-black" />
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 p-4 sm:p-8 lg:p-12 flex items-center justify-center relative z-20 overflow-y-auto">
        <div className="w-full max-w-xl bg-white border-4 border-black p-8 sm:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block p-4 bg-[#E9E9E9] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 transform -rotate-3 hover:translate-x-[2px] transition-all">
              <span className="text-black text-4xl font-black">✦</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tighter mb-3">
              {isLogin ? "Welcome back" : "Create Account"}
            </h2>
            <p className="text-black/60 font-black text-xs uppercase tracking-[0.2em]">
              {isLogin
                ? "Sign in to continue your journey"
                : "Join the next generation of experts"}
            </p>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {isLogin ? (
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(handleLogin)}
                  className="space-y-8"
                >
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-black">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black z-10" />
                            <Input
                              placeholder="Enter your email"
                              className="h-14 pl-12 bg-[#E9E9E9] border-4 border-black text-black font-bold focus:ring-0 focus:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-black/30 placeholder:font-bold rounded-none"
                              autoComplete="email"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[#FD5A1A] font-black uppercase text-[10px] italic" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-black">
                          Phone Number{" "}
                          <span className="text-black/40 text-[10px]">
                            (Optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <PhoneInput
                            value={field.value}
                            onValueChange={field.onChange}
                            countryCode={loginForm.watch("countryCode")}
                            onCountryChange={(code) =>
                              loginForm.setValue("countryCode", code)
                            }
                            placeholder="Enter Phone Number"
                          />
                        </FormControl>
                        <FormMessage className="text-[#FD5A1A] font-black uppercase text-[10px] italic" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-black">
                            Password
                          </FormLabel>
                          <Link
                            to="/forgot-password"
                            className="text-[10px] font-black uppercase text-[#0075CF] hover:underline underline-offset-4 decoration-2"
                          >
                            Forgot?
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black z-10" />
                            <Input
                              type={showLoginPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="h-14 pl-12 pr-12 bg-[#E9E9E9] border-4 border-black text-black font-bold focus:ring-0 focus:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-black/30 placeholder:font-bold rounded-none"
                              autoComplete="current-password"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowLoginPassword(!showLoginPassword)
                              }
                              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-black hover:scale-110 transition-transform"
                            >
                              {showLoginPassword ? (
                                <EyeOff className="h-5 w-5 stroke-[2.5px]" />
                              ) : (
                                <Eye className="h-5 w-5 stroke-[2.5px]" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[#FD5A1A] font-black uppercase text-[10px] italic" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 bg-[#0075CF] text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] font-black uppercase tracking-widest text-lg transition-all rounded-none mt-4"
                  >
                    {loading ? "Signing in..." : "Sign In to Portal"}
                  </Button>
                </form>
              </Form>
            ) : (
              /* Register Form */
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(handleRegister)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs font-black uppercase tracking-widest text-black">
                            Full Name
                          </FormLabel>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black z-10" />
                            <Input
                              placeholder="Enter your full name"
                              className="h-12 pl-9 bg-[#E9E9E9] border-4 border-black font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-none"
                              {...field}
                            />
                          </div>
                          <FormMessage className="text-[10px] font-black italic text-[#FD5A1A]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs font-black uppercase tracking-widest text-black">
                            Email
                          </FormLabel>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black z-10" />
                            <Input
                              placeholder="Enter your email"
                              className="h-12 pl-9 bg-[#E9E9E9] border-4 border-black font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-none"
                              {...field}
                            />
                          </div>
                          <FormMessage className="text-[10px] font-black italic text-[#FD5A1A]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={registerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-black uppercase tracking-widest text-black">
                          Phone Number{" "}
                          <span className="text-black/40 text-[10px]">
                            (Optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <PhoneInput
                            value={field.value}
                            onValueChange={field.onChange}
                            countryCode={registerForm.watch("countryCode")}
                            onCountryChange={(code) =>
                              registerForm.setValue("countryCode", code)
                            }
                            placeholder="Enter Phone Number"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-black italic text-[#FD5A1A]" />
                      </FormItem>
                    )}
                  />

                  {/* Password Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs font-black uppercase tracking-widest text-black">
                            Password
                          </FormLabel>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black z-10" />
                            <Input
                              type={showRegisterPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="h-12 pl-9 pr-9 bg-[#E9E9E9] border-4 border-black font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-none"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowRegisterPassword(!showRegisterPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-black"
                            >
                              {showRegisterPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          <FormMessage className="text-[10px] font-black italic text-[#FD5A1A]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs font-black uppercase tracking-widest text-black">
                            Confirm
                          </FormLabel>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black z-10" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="h-12 pl-9 pr-9 bg-[#E9E9E9] border-4 border-black font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-none"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-black"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          <FormMessage className="text-[10px] font-black italic text-[#FD5A1A]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Password Strength Indicator */}
                  {watchPassword && watchPassword.length > 0 && (
                    <div className="p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid grid-cols-2 gap-3">
                      <PasswordRequirement
                        met={passwordStrength.checks.length}
                        text="8+ chars"
                      />
                      <PasswordRequirement
                        met={passwordStrength.checks.uppercase}
                        text="Uppercase"
                      />
                      <PasswordRequirement
                        met={passwordStrength.checks.lowercase}
                        text="Lowercase"
                      />
                      <PasswordRequirement
                        met={passwordStrength.checks.number}
                        text="Number"
                      />
                    </div>
                  )}

                  {/* Terms */}
                  <FormField
                    control={registerForm.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border-4 border-black bg-[#E9E9E9] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-6 w-6 border-4 border-black data-[state=checked]:bg-[#0075CF] transition-colors rounded-none"
                          />
                        </FormControl>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest leading-tight cursor-pointer">
                          I agree to the{" "}
                          <Link
                            to="/terms"
                            className="text-[#0075CF] underline decoration-2"
                          >
                            Terms
                          </Link>{" "}
                          &{" "}
                          <Link
                            to="/privacy"
                            className="text-[#0075CF] underline decoration-2"
                          >
                            Privacy
                          </Link>
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 bg-[#FD5A1A] text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] font-black uppercase tracking-widest text-lg transition-all rounded-none mt-4"
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </Button>
                </form>
              </Form>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-1 bg-black" />
              <span className="text-black font-black uppercase text-xs tracking-[0.2em]">
                OR
              </span>
              <div className="flex-1 h-1 bg-black" />
            </div>

            {/* Google */}
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              variant="outline"
              className="w-full h-14 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] font-black uppercase tracking-widest text-sm transition-all rounded-none flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Toggle */}
            <div className="text-center mt-6">
              <span className="text-black/60 font-black uppercase text-[10px] tracking-widest">
                {isLogin ? "New to AOTMS? " : "Joined before? "}
              </span>
              <button
                type="button"
                onClick={toggleMode}
                className="text-[#FD5A1A] font-black uppercase text-[10px] tracking-widest hover:underline underline-offset-4 decoration-2 ml-1"
              >
                {isLogin ? "Register Now" : "Login Here"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
