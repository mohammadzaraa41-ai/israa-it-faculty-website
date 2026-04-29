import { createClient } from '@supabase/supabase-js'

// Hardcoding credentials temporarily to ensure the live site connects correctly
const supabaseUrl = 'https://kskcaqtddzzacuybfmkd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtza2NhcXRkZHp6YWN1eWJmbWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NzY0MDMsImV4cCI6MjA5MzA1MjQwM30.EQygIuX6sKNj7dC3CFtUKj1dluSzI2K5l7cZ2DrC2n8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
