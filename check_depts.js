import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://jntgoygohvixbndofzxe.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkDepts() {
  const { data, error } = await supabase.from('departments').select('*');
  console.log("Departments:");
  console.log(data);
  if (error) console.error(error);
}

checkDepts();
