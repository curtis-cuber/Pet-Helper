const fs = require('fs');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_ANON_KEY environment variables must be set.');
  process.exit(1);
}

fs.writeFileSync('js/config.js', `const SUPABASE_URL = '${url}';\nconst SUPABASE_ANON_KEY = '${key}';\nconst supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);\n`);

console.log('config.js generated from environment variables.');
