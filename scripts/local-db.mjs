import {spawnSync} from 'node:child_process';
import {existsSync,readdirSync} from 'node:fs';
const prefix=['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--config','dist/server/wrangler.json','--persist-to','.wrangler/state'];
if(!existsSync('dist/server/wrangler.json')){console.error('Jalankan npm run build terlebih dahulu.');process.exit(1)}
function query(sql){const r=spawnSync(process.execPath,[...prefix,'--command',sql,'--json'],{encoding:'utf8'});if(r.status!==0){console.error(r.stderr||r.stdout);process.exit(1)}return JSON.parse(r.stdout)[0].results}
const tables=query("SELECT name FROM sqlite_master WHERE type='table'").map(x=>x.name);
query('CREATE TABLE IF NOT EXISTS _tandai_migrations (name TEXT PRIMARY KEY)');
const files=readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort();
// Recognize the earlier release, which applied these migrations before a local journal existed.
if(tables.includes('projects'))query("INSERT OR IGNORE INTO _tandai_migrations VALUES ('"+files.find(f=>f.startsWith('0000_'))+"')");
if(tables.includes('accounts')&&tables.includes('sessions')&&query('PRAGMA table_info(projects)').some(c=>c.name==='owner_id'))query("INSERT OR IGNORE INTO _tandai_migrations VALUES ('"+files.find(f=>f.startsWith('0001_'))+"')");
const applied=new Set(query('SELECT name FROM _tandai_migrations').map(x=>x.name));
for(const file of files){if(applied.has(file))continue;const r=spawnSync(process.execPath,[...prefix,'--file','drizzle/'+file],{stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);query("INSERT INTO _tandai_migrations VALUES ('"+file.replaceAll("'","''")+"')")}
console.log('Database SQLite siap. Migrasi diterapkan tanpa menghapus data.');
