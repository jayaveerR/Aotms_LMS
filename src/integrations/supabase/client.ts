 import { createClient } from '@supabase/supabase-js';
 import type { Database } from './types';
 
 const SUPABASE_URL = "https://gcwozkmrdzdcphwyjtuw.supabase.co";
 const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdjd296a21yZHpkY3Bod3lqdHV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNzc0NjIsImV4cCI6MjA4NTg1MzQ2Mn0._8_vcxCOtm1H348Ubb_0Pdb3MaMONviE8wAQWh74urQ";
 
 export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);