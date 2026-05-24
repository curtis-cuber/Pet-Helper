// DO NOT rename this file to config.js and commit it.
// Copy this file to config.js locally for development only.
// On Vercel, set SUPABASE_URL and SUPABASE_ANON_KEY as environment variables.
// config.js is listed in .gitignore and will never be committed.

const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
