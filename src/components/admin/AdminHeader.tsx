 import { SidebarTrigger } from '@/components/ui/sidebar';
 import { Button } from '@/components/ui/button';
 import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from '@/components/ui/dropdown-menu';
 import { Bell, Search, User, Settings, LogOut, ChevronDown, ShieldCheck, AlertTriangle } from 'lucide-react';
 import { Input } from '@/components/ui/input';
 import { useAuth } from '@/hooks/useAuth';
 import { Badge } from '@/components/ui/badge';
 
 export function AdminHeader() {
   const { user, signOut } = useAuth();
   const initials = user?.user_metadata?.full_name
     ?.split(' ')
     .map((n: string) => n[0])
     .join('')
     .toUpperCase() || 'AD';
 
   return (
     <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
       <div className="flex items-center gap-4">
         <SidebarTrigger className="-ml-1" />
         
         {/* Search */}
         <div className="relative hidden md:block">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input
             placeholder="Search users, courses, logs..."
             className="pl-10 w-80 bg-muted/50"
           />
         </div>
       </div>
       
       <div className="flex items-center gap-4">
         {/* Security Alert */}
         <Button variant="ghost" size="sm" className="gap-2 text-destructive hidden sm:flex">
           <AlertTriangle className="h-4 w-4" />
           3 Alerts
         </Button>
         
         {/* Role Badge */}
         <Badge variant="destructive" className="hidden sm:flex gap-1">
           <ShieldCheck className="h-3 w-3" />
           Super Admin
         </Badge>
         
         {/* Notifications */}
         <Button variant="ghost" size="icon" className="relative">
           <Bell className="h-5 w-5" />
           <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
             8
           </span>
         </Button>
         
         {/* User Menu */}
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="flex items-center gap-2 px-2">
               <Avatar className="h-8 w-8 ring-2 ring-destructive/50">
                 <AvatarImage src={user?.user_metadata?.avatar_url} />
                 <AvatarFallback className="bg-destructive text-destructive-foreground text-sm">
                   {initials}
                 </AvatarFallback>
               </Avatar>
               <div className="hidden md:block text-left">
                 <p className="text-sm font-medium">
                   {user?.user_metadata?.full_name || 'Administrator'}
                 </p>
                 <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                   {user?.email}
                 </p>
               </div>
               <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end" className="w-56">
             <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
             <DropdownMenuSeparator />
             <DropdownMenuItem>
               <User className="mr-2 h-4 w-4" />
               Profile
             </DropdownMenuItem>
             <DropdownMenuItem>
               <Settings className="mr-2 h-4 w-4" />
               Settings
             </DropdownMenuItem>
             <DropdownMenuItem>
               <ShieldCheck className="mr-2 h-4 w-4" />
               Security
             </DropdownMenuItem>
             <DropdownMenuSeparator />
             <DropdownMenuItem onClick={signOut} className="text-destructive">
               <LogOut className="mr-2 h-4 w-4" />
               Sign out
             </DropdownMenuItem>
           </DropdownMenuContent>
         </DropdownMenu>
       </div>
     </header>
   );
 }