const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://kskcaqtddzzacuybfmkd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtza2NhcXRkZHp6YWN1eWJmbWtkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzQ3NjQwMywiZXhwIjoyMDkzMDUyNDAzfQ.J-SFw4RP5HqMs6m6MVGPuIWrqzS3mTRyVsA3Hwd3QVo';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function insertDepts() {
  const depts = [
    { id: "cis", name: { ar: "نظم المعلومات الحاسوبية", en: "Computer Information Systems" } },
    { id: "mm", name: { ar: "الوسائط المتعددة", en: "Multimedia" } },
    { id: "ns", name: { ar: "أنظمة شبكات حاسوبية", en: "Computer Networking Systems" } }
  ];

  const { data, error } = await supabase.from('departments').upsert(depts).select();
  if (error) {
    console.error("Error inserting departments:", error);
  } else {
    console.log("Successfully inserted departments:", data);
  }
}

insertDepts();
