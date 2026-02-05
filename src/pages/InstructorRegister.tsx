import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.png';
import { Mail, Lock, User, Eye, EyeOff, Upload, Briefcase, GraduationCap, FileText, Check, X, ArrowLeft } from 'lucide-react';

const instructorSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters' }).max(100, { message: 'Name must be less than 100 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
  areaOfExpertise: z.string().min(1, { message: 'Please select your area of expertise' }),
  experience: z.string().min(1, { message: 'Please select your experience level' }),
  resume: z.any().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms & Privacy Policy',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type InstructorFormData = z.infer<typeof instructorSchema>;

const expertiseOptions = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Cloud Computing',
  'Cybersecurity',
  'DevOps',
  'UI/UX Design',
  'Database Management',
  'Software Engineering',
  'Other',
];

const experienceOptions = [
  '0-1 years',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  '10+ years',
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
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<InstructorFormData>({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      areaOfExpertise: '',
      experience: '',
      agreeToTerms: false,
    },
  });

  const watchPassword = form.watch('password');
  const passwordStrength = getPasswordStrength(watchPassword || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Resume must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }
      setResumeFile(file);
      form.setValue('resume', file);
    }
  };

  const handleSubmit = async (data: InstructorFormData) => {
    setLoading(true);
    
    try {
      // Sign up the instructor
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: 'instructor',
            area_of_expertise: data.areaOfExpertise,
            experience: data.experience,
          },
          emailRedirectTo: `${window.location.origin}/instructor`,
        },
      });

      if (signUpError) throw signUpError;

      toast({
        title: 'Application Submitted!',
        description: 'Please check your email to verify your account. Your instructor application is under review.',
      });
      
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-1.5 text-xs ${met ? 'text-green-600' : 'text-muted-foreground'}`}>
      {met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Motivational Content */}
      <div className="lg:w-1/2 bg-gradient-to-br from-primary/20 via-accent/30 to-primary/40 p-6 lg:p-10 flex flex-col relative overflow-hidden">
        {/* Back Button & Logo */}
        <div className="flex items-center justify-between z-10">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <a href="/" className="flex items-center gap-3">
            <img src={logo} alt="AOTMS Logo" className="h-8 lg:h-10" />
          </a>
        </div>
        
        {/* Motivational Content */}
        <div className="flex-1 flex flex-col justify-center mt-8 lg:mt-0 z-10">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Instructor Program</span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-4">
              Share Your Knowledge, <span className="text-primary">Inspire Minds</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Join our community of expert instructors and help shape the future of learning. Create courses, conduct live sessions, and make a real impact.
            </p>
            
            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Flexible Schedule</h3>
                  <p className="text-sm text-muted-foreground">Teach on your own terms, anytime, anywhere</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Global Reach</h3>
                  <p className="text-sm text-muted-foreground">Connect with students from around the world</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Competitive Earnings</h3>
                  <p className="text-sm text-muted-foreground">Earn while doing what you love</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-accent/40 rounded-full blur-3xl pointer-events-none -z-10" />
      </div>
      
      {/* Right Panel - Registration Form */}
      <div className="lg:w-1/2 bg-background p-6 lg:p-8 flex items-center justify-center relative z-50 overflow-y-auto">
        <div className="w-full max-w-lg relative z-50 py-4">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Become an Instructor
            </h2>
            <p className="text-muted-foreground">
              Fill in your details to apply as an instructor
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            className="pl-10 h-11 bg-muted/30 border-0 rounded-xl focus:ring-2 focus:ring-primary/30"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="instructor@example.com"
                            className="pl-10 h-11 bg-muted/30 border-0 rounded-xl focus:ring-2 focus:ring-primary/30"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 2: Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 h-11 bg-muted/30 border-0 rounded-xl focus:ring-2 focus:ring-primary/30"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Confirm Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                        <FormControl>
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 h-11 bg-muted/30 border-0 rounded-xl focus:ring-2 focus:ring-primary/30"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password Strength Indicator */}
              {watchPassword && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 p-3 bg-muted/30 rounded-xl">
                  <PasswordRequirement met={passwordStrength.checks.length} text="8+ characters" />
                  <PasswordRequirement met={passwordStrength.checks.uppercase} text="Uppercase letter" />
                  <PasswordRequirement met={passwordStrength.checks.lowercase} text="Lowercase letter" />
                  <PasswordRequirement met={passwordStrength.checks.number} text="Number" />
                </div>
              )}

              {/* Row 3: Area of Expertise & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="areaOfExpertise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Area of Expertise</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 bg-muted/30 border-0 rounded-xl focus:ring-2 focus:ring-primary/30">
                            <SelectValue placeholder="Select expertise" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {expertiseOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Experience</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 bg-muted/30 border-0 rounded-xl focus:ring-2 focus:ring-primary/30">
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {experienceOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Resume Upload */}
              <FormField
                control={form.control}
                name="resume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Resume/CV <span className="text-muted-foreground text-xs">(Optional, Max 5MB)</span></FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex items-center gap-3 h-11 px-4 bg-muted/30 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors">
                          <Upload className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {resumeFile ? resumeFile.name : 'Upload your resume (PDF, DOC)'}
                          </span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Terms & Conditions */}
              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 bg-muted/20 rounded-xl">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm cursor-pointer">
                        I agree to the{' '}
                        <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/auth" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
