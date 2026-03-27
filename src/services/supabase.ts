import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase credentials not found. Check your .env file!");
}
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
