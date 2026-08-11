import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;
let presenceAvailable = false;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    presenceAvailable = true;
  } catch (error) {
    console.warn('Supabase initialization failed:', error);
  }
}

export { supabase, presenceAvailable };

export const PRESENCE_CHANNEL = 'hyderabad-deluxe-presence';
