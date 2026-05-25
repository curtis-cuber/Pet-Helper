const fs = require('fs');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  // Write a config that shows a clear error in the browser instead of crashing
  fs.writeFileSync('js/config.js',
    `const supabase = { from: () => { throw new Error('Supabase env vars not set in Vercel. Add SUPABASE_URL and SUPABASE_ANON_KEY in Vercel → Settings → Environment Variables.'); } };\n`
  );
  console.warn('WARNING: SUPABASE_URL or SUPABASE_ANON_KEY not set. Site will show config errors.');
} else {
  fs.writeFileSync('js/config.js',
    `const SUPABASE_URL = '${url}';\nconst SUPABASE_ANON_KEY = '${key}';\nconst supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);\n`
  );
  console.log('config.js generated successfully.');
}
