 import { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { Button } from '@/components/ui/button';
 import { useToast } from '@/hooks/use-toast';
 import { supabase } from '@/integrations/supabase/client';
 import logo from '@/assets/logo.png';
 
 export default function Auth() {
   const [loading, setLoading] = useState(false);
   const { toast } = useToast();
   const navigate = useNavigate();
 
   const handleGoogleSignIn = async () => {
     setLoading(true);
     const { error } = await supabase.auth.signInWithOAuth({
       provider: 'google',
       options: {
         redirectTo: `${window.location.origin}/dashboard`,
       },
     });
     
     if (error) {
       toast({
         title: 'Login Failed',
         description: error.message,
         variant: 'destructive',
       });
       setLoading(false);
     }
   };
 
   return (
     <div className="min-h-screen flex flex-col lg:flex-row">
       {/* Left Panel - Gradient Background */}
       <div className="lg:w-1/2 bg-gradient-to-br from-accent/30 via-primary/20 to-accent/40 p-8 lg:p-12 flex flex-col relative overflow-hidden">
         {/* Logo */}
         <a href="/" className="flex items-center gap-3 z-10">
           <img src={logo} alt="AOTMS Logo" className="h-10 lg:h-12" />
         </a>
         
         {/* Motivational Text */}
         <div className="flex-1 flex flex-col justify-center mt-8 lg:mt-0 z-10">
           <p className="text-muted-foreground text-sm mb-2">You can easily</p>
           <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight">
             Get access to your personal hub for learning and growth.
           </h1>
         </div>
         
         {/* Decorative gradient orbs */}
         <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-accent/40 rounded-full blur-3xl" />
         <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/30 rounded-full blur-3xl" />
       </div>
       
       {/* Right Panel - Auth Form */}
       <div className="lg:w-1/2 bg-background p-8 lg:p-12 flex items-center justify-center">
         <div className="w-full max-w-md">
           {/* Icon */}
           <div className="flex justify-center mb-6">
             <div className="w-10 h-10 flex items-center justify-center">
               <span className="text-accent text-3xl">✦</span>
             </div>
           </div>
           
           {/* Header */}
           <div className="text-center mb-8">
             <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
               Create an account
             </h2>
             <p className="text-muted-foreground text-sm">
               Access your courses, track progress, and keep everything flowing in one place.
             </p>
           </div>
           
           {/* Google Sign In Button */}
           <Button
             onClick={handleGoogleSignIn}
             disabled={loading}
             className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-medium text-base rounded-lg flex items-center justify-center gap-3"
           >
             <svg className="w-5 h-5" viewBox="0 0 24 24">
               <path
                 fill="currentColor"
                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
               />
               <path
                 fill="currentColor"
                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
               />
               <path
                 fill="currentColor"
                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
               />
               <path
                 fill="currentColor"
                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
               />
             </svg>
             {loading ? 'Connecting...' : 'Continue with Google'}
           </Button>
           
           {/* Divider */}
           <div className="flex items-center gap-4 my-6">
             <div className="flex-1 h-px bg-border" />
             <span className="text-muted-foreground text-sm">or continue with</span>
             <div className="flex-1 h-px bg-border" />
           </div>
           
           {/* Alternative Sign In Options (disabled/coming soon) */}
           <div className="flex justify-center gap-4">
             <Button
               variant="outline"
               size="icon"
               className="w-12 h-12 rounded-lg border-2"
               disabled
             >
               <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
               </svg>
             </Button>
             <Button
               variant="outline"
               size="icon"
               className="w-12 h-12 rounded-lg border-2"
               disabled
             >
               <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
               </svg>
             </Button>
           </div>
           
           {/* Footer text */}
           <p className="text-center text-sm text-muted-foreground mt-8">
             By continuing, you agree to our{' '}
             <a href="#" className="text-foreground hover:underline">Terms of Service</a>
             {' '}and{' '}
             <a href="#" className="text-foreground hover:underline">Privacy Policy</a>
           </p>
         </div>
       </div>
     </div>
   );
 }