
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kskcaqtddzzacuybfmkd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtza2NhcXRkZHp6YWN1eWJmbWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NzY0MDMsImV4cCI6MjA5MzA1MjQwM30.EQygIuX6sKNj7dC3CFtUKj1dluSzI2K5l7cZ2DrC2n8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deepCheck() {
  console.log("--- DEEP DATABASE AUDIT ---");
  
  // 1. Check alumni_requests
  const { data: requests, error: reqErr } = await supabase.from('alumni_requests').select('*');
  console.log(`Requests count: ${requests?.length || 0}`);
  requests?.forEach(r => {
    console.log(`Request ID: ${r.id} | UserID: ${r.user_id} | Name: ${r.full_name} | Status: ${r.status}`);
  });

  // 2. Check users status
  const { data: users, error: userErr } = await supabase.from('users').select('id, username, is_alumni');
  console.log(`Users count: ${users?.length || 0}`);

  // 3. Automated Fix: If a user is is_alumni=true, delete their requests
  for (const u of users) {
    if (u.is_alumni) {
      const userRequests = requests?.filter(r => String(r.user_id) === String(u.id));
      if (userRequests?.length > 0) {
        console.log(`User ${u.username} is already Alumni but has ${userRequests.length} requests. Deleting them...`);
        for (const r of userRequests) {
          const { error: delErr } = await supabase.from('alumni_requests').delete().eq('id', r.id);
          if (!delErr) console.log(`Deleted request ${r.id}`);
        }
      }
    }
  }

  // 4. Automated Fix: If a request is 'approved', update user and delete request
  for (const r of requests) {
    if (r.status === 'approved') {
      console.log(`Found approved request for ${r.full_name} (User: ${r.user_id}). Processing...`);
      await supabase.from('users').update({ is_alumni: true }).eq('id', r.user_id);
      await supabase.from('alumni_requests').delete().eq('id', r.id);
      console.log(`Processed and deleted approved request ${r.id}`);
    }
  }

  console.log("--- AUDIT COMPLETE ---");
}

deepCheck();
