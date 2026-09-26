import pg from 'pg';
import { readFileSync } from 'fs';

const { Client } = pg;

// Parse DIRECT_URL from .env.local
const envContents = readFileSync('.env.local', 'utf8');
let DIRECT_URL = '';
for (const line of envContents.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (trimmed.startsWith('DIRECT_URL=')) {
    DIRECT_URL = trimmed.replace('DIRECT_URL=', '').replace(/^"|"$/g, '');
    break;
  }
}

if (!DIRECT_URL) {
  console.error('❌ DIRECT_URL not found in .env.local');
  process.exit(1);
}

console.log('🔗 Connecting via DIRECT_URL...');
const client = new Client({ connectionString: DIRECT_URL, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  console.log('✅ Connected to database\n');

  // Run migration
  console.log('⏳ Running migration (20260831000000_init_schema.sql)...');
  const migrationSql = readFileSync('./supabase/migrations/20260831000000_init_schema.sql', 'utf8');
  await client.query(migrationSql);
  console.log('✅ Migration complete!\n');

  // Run seed
  console.log('⏳ Running seed (seed.sql)...');
  const seedSql = readFileSync('./supabase/seed.sql', 'utf8');
  await client.query(seedSql);
  console.log('✅ Seed data inserted!\n');

  // Verify tables
  console.log('📋 Verifying tables...');
  const { rows } = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);
  if (rows.length === 0) {
    console.log('⚠️  No tables found in public schema');
  } else {
    rows.forEach(r => console.log(`  ✅ ${r.table_name}`));
  }

} catch (err) {
  console.error('❌ Error:', err.message);
  if (err.detail) console.error('   Detail:', err.detail);
} finally {
  await client.end();
  console.log('\n--- Done ---');
}
