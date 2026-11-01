import {z} from 'zod';
import {readJSON,RequestError} from '@/lib/request';
import {authDb,hosted,principal,validOrigin,createSession,logout,claimLegacy} from '@/lib/auth';
import {hashPassword,verifyPassword,tokenHash,randomToken} from '@/lib/password';
import {defaultPrefs} from '@/lib/model';
export const dynamic='force-dynamic';
const respond=(v:unknown,status=200,cookie?:string)=>Response.json(v,{status,headers:{'Cache-Control':'no-store',...(cookie?{'Set-Cookie':cookie}:{})}});
const emailSchema=z.string().trim().email().max(254).transform(s=>s.toLowerCase());
const signupSchema=z.object({name:z.string().trim().min(1).max(100),workspace:z.string().trim().min(1).max(100),email:emailSchema,password:z.string().min(12).max(256)});
const dummyHash='scrypt:16384:8:5:'+('00'.repeat(16))+':'+('00'.repeat(32));
async function limited(key:string,max:number,window:number){const d=authDb(),now=Date.now(),hash=await tokenHash(key);await d.prepare('INSERT INTO auth_attempts (key,count,window_start) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN window_start<? THEN 1 ELSE count+1 END,window_start=CASE WHEN window_start<? THEN excluded.window_start ELSE window_start END').bind(hash,now,now-window,now-window).run();const a=await d.prepare('SELECT count FROM auth_attempts WHERE key=?').bind(hash).first<{count:number}>();return{blocked:(a?.count||0)>max,hash};}
export async function GET(request:Request){try{const isHosted=hosted(request),user=await principal(request),d=authDb();const account=user?await d.prepare('SELECT id FROM accounts WHERE id=?').bind(user.id).first():null;const configured=isHosted?!!account:!!await d.prepare("SELECT id FROM accounts WHERE provider='local' LIMIT 1").first();return respond({mode:isHosted?'chatgpt':'local',authenticated:!!user&&!!account,needsSetup:!configured,registrationEnabled:true,profiles:isHosted?[]:(await d.prepare("SELECT id,name FROM accounts WHERE provider='local' ORDER BY created_at,id").all()).results,user:user?{name:user.name,email:user.email}:null,signInUrl:'/signin-with-chatgpt?return_to=%2F',signOutUrl:'/signout-with-chatgpt?return_to=%2F'});}catch(e){console.error('Auth status unavailable');return respond({error:'Autentikasi belum siap. Pastikan migrasi database telah dijalankan.'},503);}}
export async function POST(request:Request){try{
 const body=await readJSON(request,8192);if(!validOrigin(request))return respond({error:'Permintaan tidak diizinkan.'},403);
 const d=authDb(),isHosted=hosted(request),deviceProfile=body.action==='create-profile'&&!hosted(request);
 if(deviceProfile){const profileCount=await d.prepare("SELECT count(*) AS n FROM accounts WHERE provider='local'").first<{n:number}>();if((profileCount?.n||0)>=100)return respond({error:'Batas 100 profil pada perangkat ini tercapai.'},409);const first=!await d.prepare("SELECT id FROM accounts WHERE provider='local' LIMIT 1").first();body.action=first?'setup':'register';body.name=typeof body.name==='string'&&body.name.trim()?body.name:'Pengguna';body.workspace='Pribadi';body.email=crypto.randomUUID()+'@device.invalid';}
 if(body.action==='unlock'&&!isHosted){if(typeof body.profileId!=='string'||body.profileId.length>200)return respond({error:'Pilih profil Anda.'},400);const profile=await d.prepare("SELECT email FROM accounts WHERE id=? AND provider='local'").bind(body.profileId).first<{email:string}>();body.action='login';body.email=profile?.email||'unknown@device.invalid';}
 if(['change-password','recover-password','recovery-code','rename-profile'].includes(body.action)&&!isHosted){const a=await principal(request),profile=body.action==='recover-password'?await d.prepare("SELECT id,password_hash FROM accounts WHERE id=? AND provider='local'").bind(String(body.profileId)).first<{id:string;password_hash:string}>():a?await d.prepare('SELECT id,password_hash FROM accounts WHERE id=?').bind(a.id).first<{id:string;password_hash:string}>():null;const rate=await limited('security:'+(request.headers.get('cf-connecting-ip')||'local'),20,15*60*1000);if(rate.blocked)return respond({error:'Terlalu banyak percobaan. Tunggu 15 menit.'},429);let valid=false;if(body.action==='recover-password'){const saved=profile?await d.prepare('SELECT hash FROM recoveries WHERE account_id=?').bind(profile.id).first<{hash:string}>():null;valid=!!saved&&saved.hash===await tokenHash(String(body.code));}else valid=!!profile&&await verifyPassword(String(body.currentPassword),profile.password_hash||dummyHash);if(!profile||!valid)return respond({error:'Profil, kata sandi, atau kode pemulihan tidak sesuai.'},401);if(body.action==='rename-profile'){const name=z.string().trim().min(1).max(100).parse(body.name);await d.prepare('UPDATE accounts SET name=? WHERE id=?').bind(name,profile.id).run();return respond({ok:true});}const code='TT-'+randomToken().slice(0,32).match(/.{8}/g)!.join('-'),hash=await tokenHash(code);const queries=[d.prepare('INSERT INTO recoveries (account_id,hash) VALUES (?,?) ON CONFLICT(account_id) DO UPDATE SET hash=excluded.hash').bind(profile.id,hash)];if(body.action!=='recovery-code'){const password=z.string().min(12).max(256).parse(body.newPassword);queries.push(d.prepare('UPDATE accounts SET password_hash=? WHERE id=?').bind(await hashPassword(password),profile.id),d.prepare('DELETE FROM sessions WHERE account_id=?').bind(profile.id));}await d.batch(queries);return respond({ok:true,recoveryCode:code},200,body.action!=='recovery-code'?await createSession(profile.id,request,false):undefined);}
 if(body.action==='logout'){if(isHosted)return respond({redirect:'/signout-with-chatgpt?return_to=%2F'});return respond({ok:true},200,await logout(request));}
 if(body.action==='setup'&&isHosted){
  const a=await principal(request);if(!a)return respond({error:'Masuk dengan akun ChatGPT terlebih dahulu.'},401);
  const p=z.object({name:z.string().trim().min(1).max(100),workspace:z.string().trim().min(1).max(100)}).safeParse(body);if(!p.success)return respond({error:'Lengkapi nama dan nama workspace.'},400);
  await d.prepare('INSERT OR IGNORE INTO accounts (id,email,name,provider,created_at) VALUES (?,?,?,?,?)').bind(a.id,a.email.trim().toLowerCase(),p.data.name,'chatgpt',Date.now()).run();
  await claimLegacy(a.id,a.provider,a.email);
  const existing=await d.prepare('SELECT data FROM preferences WHERE id=?').bind('prefs:'+a.id).first<{data:string}>();
  const prefs={...(existing?JSON.parse(existing.data):defaultPrefs),name:p.data.name,workspace:p.data.workspace};
  await d.prepare('INSERT INTO preferences (id,data,updated_at) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at').bind('prefs:'+a.id,JSON.stringify(prefs),new Date().toISOString()).run();return respond({ok:true});
 }
 if((body.action==='setup'||body.action==='register')&&!isHosted){
  const first=body.action==='setup';
  if(first&&await d.prepare("SELECT id FROM accounts WHERE provider='local' LIMIT 1").first())return respond({error:'Setup awal sudah selesai. Buat profil baru untuk pengguna lain.'},409);
  const p=signupSchema.safeParse(body);if(!p.success)return respond({error:'Isi nama, workspace, email valid, dan kata sandi minimal 12 karakter.'},400);const v=p.data;
  const rate=await limited('register:'+(request.headers.get('cf-connecting-ip')||'local'),10,60*60*1000);if(rate.blocked)return respond({error:'Terlalu banyak pendaftaran. Silakan coba kembali nanti.'},429);
  if(await d.prepare("SELECT id FROM accounts WHERE provider='local' AND email=?").bind(v.email).first())return respond({error:'Email sudah terdaftar. Silakan masuk atau gunakan email lain.'},409);
  const id=first?'local-owner':'local:'+crypto.randomUUID(),passwordHash=await hashPassword(v.password);
  try{await d.prepare("INSERT INTO accounts (id,email,name,provider,password_hash,created_at) VALUES (?,?,?,'local',?,?)").bind(id,v.email,v.name,passwordHash,Date.now()).run();}catch{return respond({error:'Akun tidak dapat dibuat. Email mungkin sudah terdaftar; silakan masuk.'},409)}
  if(first)await claimLegacy(id,'local',v.email);
  const old=await d.prepare('SELECT data FROM preferences WHERE id=?').bind('prefs:'+id).first<{data:string}>();const prefs={...(old?JSON.parse(old.data):defaultPrefs),name:v.name,workspace:v.workspace};
  await d.prepare('INSERT INTO preferences (id,data,updated_at) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at').bind('prefs:'+id,JSON.stringify(prefs),new Date().toISOString()).run();
  const recoveryCode='TT-'+randomToken().slice(0,32).match(/.{8}/g)!.join('-');await d.prepare('INSERT INTO recoveries (account_id,hash) VALUES (?,?)').bind(id,await tokenHash(recoveryCode)).run();return respond({ok:true,recoveryCode},200,await createSession(id,request,!deviceProfile));
 }
 if(body.action==='login'&&!isHosted){
  const p=z.object({email:emailSchema,password:z.string().min(1).max(256),remember:z.boolean().optional()}).safeParse(body);if(!p.success)return respond({error:'Email atau kata sandi tidak sesuai.'},401);
  const accountRate=await limited('login:email:'+p.data.email,10,15*60*1000),sourceRate=await limited('login:source:'+(request.headers.get('cf-connecting-ip')||'local'),100,15*60*1000);
  if(accountRate.blocked||sourceRate.blocked)return respond({error:'Terlalu banyak percobaan. Tunggu 15 menit lalu coba kembali.'},429);
  const a=await d.prepare("SELECT id,email,password_hash FROM accounts WHERE provider='local' AND email=?").bind(p.data.email).first<{id:string;email:string;password_hash:string}>();
  const valid=await verifyPassword(p.data.password,a?.password_hash||dummyHash);if(!a||!valid)return respond({error:'Email atau kata sandi tidak sesuai.'},401);
  await d.prepare('DELETE FROM auth_attempts WHERE key=?').bind(accountRate.hash).run();return respond({ok:true},200,await createSession(a.id,request,!!p.data.remember));
 }
 return respond({error:isHosted?'Gunakan autentikasi ChatGPT untuk mendaftar atau masuk.':'Aksi tidak dikenali.'},400);
}catch(e){if(e instanceof RequestError)return respond({error:e.message},e.status);console.error('Auth request failed');return respond({error:'Permintaan belum dapat diproses. Coba kembali.'},500);}}
