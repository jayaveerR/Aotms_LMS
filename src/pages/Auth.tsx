 import { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { useAuth } from '@/hooks/useAuth';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { useToast } from '@/hooks/use-toast';
 import { GraduationCap, Mail, Lock, User } from 'lucide-react';
 import logo from '@/assets/logo.png';
 
 export default function Auth() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [fullName, setFullName] = useState('');
   const [loading, setLoading] = useState(false);
   const { signIn, signUp } = useAuth();
   const { toast } = useToast();
   const navigate = useNavigate();
 
   const handleSignIn = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
     const { error } = await signIn(email, password);
     setLoading(false);
     
     if (error) {
       toast({
         title: 'Login Failed',
         description: error.message,
         variant: 'destructive',
       });
     } else {
       toast({ title: 'Welcome back!' });
       navigate('/dashboard');
     }
   };
 
   const handleSignUp = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
     const { error } = await signUp(email, password, fullName);
     setLoading(false);
     
     if (error) {
       toast({
         title: 'Registration Failed',
         description: error.message,
         variant: 'destructive',
       });
     } else {
       toast({
         title: 'Account Created!',
         description: 'Please check your email to verify your account.',
       });
     }
   };
 
   return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
       <div className="w-full max-w-md">
         <div className="flex justify-center mb-8">
           <a href="/" className="flex items-center gap-3">
             <img src={logo} alt="AOTMS Logo" className="h-14" />
           </a>
         </div>
         
         <Card className="shadow-large">
           <CardHeader className="text-center pb-2">
             <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
               <GraduationCap className="w-6 h-6 text-primary" />
             </div>
             <CardTitle className="text-2xl font-bold">Student Portal</CardTitle>
             <CardDescription>Access your learning dashboard</CardDescription>
           </CardHeader>
           
           <CardContent>
             <Tabs defaultValue="login" className="w-full">
               <TabsList className="grid w-full grid-cols-2 mb-6">
                 <TabsTrigger value="login">Login</TabsTrigger>
                 <TabsTrigger value="register">Register</TabsTrigger>
               </TabsList>
               
               <TabsContent value="login">
                 <form onSubmit={handleSignIn} className="space-y-4">
                   <div className="space-y-2">
                     <Label htmlFor="login-email">Email</Label>
                     <div className="relative">
                       <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                       <Input
                         id="login-email"
                         type="email"
                         placeholder="student@example.com"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="pl-10"
                         required
                       />
                     </div>
                   </div>
                   
                   <div className="space-y-2">
                     <Label htmlFor="login-password">Password</Label>
                     <div className="relative">
                       <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                       <Input
                         id="login-password"
                         type="password"
                         placeholder="••••••••"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="pl-10"
                         required
                       />
                     </div>
                   </div>
                   
                   <Button type="submit" className="w-full" disabled={loading}>
                     {loading ? 'Signing in...' : 'Sign In'}
                   </Button>
                 </form>
               </TabsContent>
               
               <TabsContent value="register">
                 <form onSubmit={handleSignUp} className="space-y-4">
                   <div className="space-y-2">
                     <Label htmlFor="register-name">Full Name</Label>
                     <div className="relative">
                       <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                       <Input
                         id="register-name"
                         type="text"
                         placeholder="John Doe"
                         value={fullName}
                         onChange={(e) => setFullName(e.target.value)}
                         className="pl-10"
                         required
                       />
                     </div>
                   </div>
                   
                   <div className="space-y-2">
                     <Label htmlFor="register-email">Email</Label>
                     <div className="relative">
                       <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                       <Input
                         id="register-email"
                         type="email"
                         placeholder="student@example.com"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="pl-10"
                         required
                       />
                     </div>
                   </div>
                   
                   <div className="space-y-2">
                     <Label htmlFor="register-password">Password</Label>
                     <div className="relative">
                       <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                       <Input
                         id="register-password"
                         type="password"
                         placeholder="••••••••"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="pl-10"
                         minLength={6}
                         required
                       />
                     </div>
                   </div>
                   
                   <Button type="submit" className="w-full" disabled={loading}>
                     {loading ? 'Creating account...' : 'Create Account'}
                   </Button>
                 </form>
               </TabsContent>
             </Tabs>
           </CardContent>
         </Card>
       </div>
     </div>
   );
 }