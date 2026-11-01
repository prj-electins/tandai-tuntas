import {spawn,spawnSync} from 'node:child_process';
import {mkdirSync,readdirSync,rmSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createServer} from 'node:net';
const temp=resolve('work/auth-qa-'+crypto.randomUUID());mkdirSync(temp,{recursive:true});
const config=resolve('dist/server/wrangler.json'),wrangler=resolve('node_modules/wrangler/bin/wrangler.js'),envscript=resolve('scripts/sites-env.mjs');
if(!existsSync(config))throw Error('Jalankan npm run build dahulu.');
let server;let code=1;try{
for(const file of readdirSync('drizzle').filter(x=>x.endsWith('.sql')).sort()){const r=spawnSync(process.execPath,['--import',envscript,wrangler,'d1','execute','DB','--local','--config',config,'--persist-to',temp,'--file',resolve('drizzle',file)],{encoding:'utf8'});if(r.status!==0)throw Error(r.stderr||r.stdout)}
const choose=createServer();await new Promise(r=>choose.listen(0,'127.0.0.1',r));const port=choose.address().port;await new Promise(r=>choose.close(r));
server=spawn(process.execPath,['--import',envscript,wrangler,'dev','--config',config,'--local','--persist-to',temp,'--ip','127.0.0.1','--port',String(port),'--inspector-port','0'],{stdio:['ignore','pipe','pipe']});let logs='';server.stdout.on('data',d=>logs+=d);server.stderr.on('data',d=>logs+=d);const url='http://127.0.0.1:'+port;let ready=false;for(let i=0;i<160;i++){try{const r=await fetch(url+'/api/auth');if(r.ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,250))}if(!ready)throw Error('Server QA gagal berjalan: '+logs.slice(-1500));
function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(f=>f.isDirectory()?files(join(dir,f.name)):[join(dir,f.name)])}const db=files(temp).find(f=>f.endsWith('.sqlite')&&!f.endsWith('/metadata.sqlite'));if(!db)throw Error('Database QA tidak ditemukan');
const result=await new Promise(resolveResult=>{const p=spawn(process.execPath,['--experimental-strip-types','--test',process.argv[2]||'tests/auth-api.test.mjs'],{env:{...process.env,TEST_AUTH_URL:url,TEST_DB_FILE:db},stdio:'inherit'});p.on('exit',resolveResult)});code=result??1;if(code!==0)console.error(logs.slice(-7000));
}finally{if(server){server.kill('SIGINT');await new Promise(r=>server.once('exit',r))}rmSync(temp,{recursive:true,force:true})}process.exitCode=code;
