
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kskcaqtddzzacuybfmkd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtza2NhcXRkZHp6YWN1eWJmbWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NzY0MDMsImV4cCI6MjA5MzA1MjQwM30.EQygIuX6sKNj7dC3CFtUKj1dluSzI2K5l7cZ2DrC2n8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateUserIds() {
  console.log("--- USER ID MIGRATION STARTED ---");
  
  // 1. Fetch all users
  const { data: users, error: userErr } = await supabase.from('users').select('*');
  if (userErr) {
    console.error("Error fetching users:", userErr);
    return;
  }

  for (const user of users) {
    const oldId = user.id;
    const newId = String(user.username);

    if (oldId === newId) {
      console.log(`User ${newId} already has correct ID.`);
      continue;
    }

    console.log(`Migrating User: ${user.username} (${oldId} -> ${newId})`);

    try {
      // A. Create new record with new ID (copy of old)
      const newUserRecord = { ...user, id: newId };
      const { error: insErr } = await supabase.from('users').insert([newUserRecord]);
      
      if (insErr) {
        console.error(`  Failed to create new record for ${newId}:`, insErr.message);
        continue;
      }

      // B. Update Foreign Keys in other tables
      // Update alumni_requests
      const { error: relErr1 } = await supabase.from('alumni_requests').update({ user_id: newId }).eq('user_id', oldId);
      if (relErr1) console.error(`  Error updating alumni_requests for ${newId}:`, relErr1.message);

      // Update posts
      const { error: relErr2 } = await supabase.from('posts').update({ author_id: newId }).eq('author_id', oldId);
      if (relErr2) console.error(`  Error updating posts for ${newId}:`, relErr2.message);

      // Update comments
      const { error: relErr3 } = await supabase.from('comments').update({ author_id: newId }).eq('author_id', oldId);
      if (relErr3) console.error(`  Error updating comments for ${newId}:`, relErr3.message);

      // C. Delete old record
      const { error: delErr } = await supabase.from('users').delete().eq('id', oldId);
      if (delErr) {
        console.error(`  Failed to delete old record ${oldId}:`, delErr.message);
      } else {
        console.log(`  Successfully migrated ${user.username}`);
      }

    } catch (err) {
      console.error(`  Unexpected error for ${user.username}:`, err);
    }
  }

  console.log("--- MIGRATION COMPLETE ---");
}

migrateUserIds();
