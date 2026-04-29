
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = "https://kskcaqtddzzacuybfmkd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtza2NhcXRkZHp6YWN1eWJmbWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NzY0MDMsImV4cCI6MjA5MzA1MjQwM30.EQygIuX6sKNj7dC3CFtUKj1dluSzI2K5l7cZ2DrC2n8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAndFix() {
  console.log("Checking for approved but unprocessed alumni requests...");
  
  // 1. Get all alumni requests
  const { data: requests, error: reqError } = await supabase.from('alumni_requests').select('*');
  if (reqError) {
    console.error("Error fetching requests:", reqError);
    return;
  }
  
  console.log(`Found ${requests.length} total requests.`);
  
  for (const req of requests) {
    if (req.status === 'approved') {
      console.log(`Processing approved request for ${req.full_name} (${req.user_id})...`);
      
      // Update user
      const { error: userError } = await supabase
        .from('users')
        .update({ is_alumni: true })
        .eq('id', req.user_id);
        
      if (userError) {
        console.error(`Failed to update user ${req.user_id}:`, userError);
      } else {
        console.log(`User ${req.user_id} marked as alumni.`);
        
        // Delete request
        const { error: delError } = await supabase.from('alumni_requests').delete().eq('id', req.id);
        if (delError) console.error(`Failed to delete request ${req.id}:`, delError);
        else console.log(`Request ${req.id} deleted.`);
      }
    } else {
       console.log(`Request for ${req.full_name} is still ${req.status}.`);
    }
  }
  
  console.log("Check complete.");
}

checkAndFix();
