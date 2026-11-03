import {authDb,readyAccount} from '@/lib/auth';
import {today} from '@/lib/model';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 const account=await readyAccount(request);if(!account)return Response.json({error:'Silakan masuk.'},{status:401});
 const db=authDb();const spaces=await db.prepare('SELECT w.id,p.data FROM workspaces w LEFT JOIN preferences p ON p.id=\'prefs:\'||w.id WHERE w.account_id=? AND w.archived_at IS NULL').bind(account.id).all<{id:string;data:string|null}>();
 const result:{id:string;title:string;workspaceId:string;reminderAt:string;kind:'scheduled'|'ongoing';day?:string}[]=[];
 for(const space of spaces.results){const prefs=space.data?JSON.parse(space.data):{reminders:true,daily:true,timezone:'Asia/Makassar'};if(!prefs.reminders)continue;const day=today(prefs.timezone||'Asia/Makassar');
  const rows=await db.prepare("SELECT data FROM tasks WHERE owner_id=? AND status!='done' AND ((json_extract(data,'$.reminderAt')!='' AND datetime(json_extract(data,'$.reminderAt'))<=datetime('now') AND datetime(json_extract(data,'$.reminderAt'))>=datetime('now','-1 day')) OR (?=1 AND status='doing' AND due_date=?)) ORDER BY id LIMIT 100").bind(space.id,prefs.daily?1:0,day).all<{data:string}>();
  for(const row of rows.results){const task=JSON.parse(row.data);const scheduled=task.reminderAt&&Date.parse(task.reminderAt)<=Date.now()&&Date.parse(task.reminderAt)>=Date.now()-86400000;result.push({id:task.id,title:task.title,workspaceId:space.id,reminderAt:scheduled?task.reminderAt:'',kind:scheduled?'scheduled':'ongoing',...(scheduled?{}:{day})});}
 }
 return Response.json(result,{headers:{'Cache-Control':'no-store'}});
}
