
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kskcaqtddzzacuybfmkd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtza2NhcXRkZHp6YWN1eWJmbWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NzY0MDMsImV4cCI6MjA5MzA1MjQwM30.EQygIuX6sKNj7dC3CFtUKj1dluSzI2K5l7cZ2DrC2n8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fullReset() {
  console.log("--- FULL RESET STARTED ---");
  
  // 1. Delete ALL alumni requests
  const { error: delErr } = await supabase.from('alumni_requests').delete().neq('id', 'placeholder'); // delete all
  if (delErr) console.error("Error deleting requests:", delErr);
  else console.log("All alumni requests deleted.");

  // 2. Reset is_alumni status for AE1234 and all other students (optional, but AE1234 specifically)
  const { error: userErr } = await supabase.from('users').update({ is_alumni: false }).eq('username', 'AE1234');
  if (userErr) console.error("Error resetting user AE1234:", userErr);
  else console.log("User AE1234 reset to student status (is_alumni = false).");

  console.log("--- RESET COMPLETE ---");
}

fullReset();
