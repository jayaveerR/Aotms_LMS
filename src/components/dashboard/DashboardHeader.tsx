 import { SidebarTrigger } from '@/components/ui/sidebar';
 import { Bell, Search } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
 import { useAuth } from '@/hooks/useAuth';
 
 export function DashboardHeader() {
   const { user } = useAuth();
   const initials = user?.email?.slice(0, 2).toUpperCase() || 'ST';
 
   return (
     <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
       <SidebarTrigger className="-ml-1" />
       
       <div className="flex-1 flex items-center gap-4">
         <div className="relative hidden md:block w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input
             placeholder="Search courses, exams..."
             className="pl-10 bg-muted/50"
           />
         </div>
       </div>
       
       <div className="flex items-center gap-3">
         <Button variant="ghost" size="icon" className="relative">
           <Bell className="h-5 w-5" />
           <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-medium text-accent-foreground flex items-center justify-center">
             3
           </span>
         </Button>
         
         <Avatar className="h-9 w-9">
           <AvatarImage src="" />
           <AvatarFallback className="bg-primary text-primary-foreground text-sm">
             {initials}
           </AvatarFallback>
         </Avatar>
       </div>
     </header>
   );
 }