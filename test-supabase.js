import { createClient } from '@supabase/supabase-js';

async function test() {
  try {
    const tempClient = createClient('https://example.supabase.co', 'dummy-key', {
      auth: { persistSession: false }
    });
    
    // Test what happens if we pass undefined values
    const res = await tempClient.auth.signUp({
      email: undefined,
      password: 'testpassword',
      options: {
        data: {
          full_name: undefined,
          role: 'STUDENT'
        }
      }
    });
    console.log("Res:", res);
  } catch (e) {
    console.error("Caught error:", e);
  }
}

test();
