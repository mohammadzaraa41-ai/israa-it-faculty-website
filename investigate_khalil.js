
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kskcaqtddzzacuybfmkd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtza2NhcXRkZHp6YWN1eWJmbWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NzY0MDMsImV4cCI6MjA5MzA1MjQwM30.EQygIuX6sKNj7dC3CFtUKj1dluSzI2K5l7cZ2DrC2n8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function investigateKhalil() {
  console.log("--- INVESTIGATING KHALIL ---");
  
  // 1. Find user by name
  const { data: users } = await supabase.from('users').select('*').ilike('name_ar', '%خليل%');
  console.log("Users found with name 'خليل':", users?.length);
  users?.forEach(u => console.log(`User ID: ${u.id} | Name: ${u.name_ar} | Alumni: ${u.is_alumni} | UN: ${u.username}`));

  // 2. Find requests for these users
  const userIds = users?.map(u => u.id) || [];
  const { data: requests } = await supabase.from('alumni_requests').select('*').in('user_id', userIds);
  console.log("Requests found for these users:", requests?.length);
  requests?.forEach(r => console.log(`Req ID: ${r.id} | UserID: ${r.user_id} | Name: ${r.full_name} | Status: ${r.status}`));

  console.log("--- END INVESTIGATION ---");
}

investigateKhalil();
