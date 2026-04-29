
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kskcaqtddzzacuybfmkd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtza2NhcXRkZHp6YWN1eWJmbWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NzY0MDMsImV4cCI6MjA5MzA1MjQwM30.EQygIuX6sKNj7dC3CFtUKj1dluSzI2K5l7cZ2DrC2n8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listUsers() {
  const { data: users, error } = await supabase.from('users').select('id, username, name_ar, is_alumni, role');
  if (error) {
    console.error(error);
    return;
  }
  console.log("--- USERS LIST ---");
  users.forEach(u => {
    console.log(`ID: ${u.id} | Name: ${u.name_ar} | User: ${u.username} | Alumni: ${u.is_alumni} | Role: ${u.role}`);
  });
  console.log("------------------");
}

listUsers();
