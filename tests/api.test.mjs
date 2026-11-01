import test from 'node:test';
import assert from 'node:assert/strict';
import {blankTask,blankVideo,uid,videoProgress} from '../lib/model.ts';
const base=process.env.TEST_URL||'http://127.0.0.1:5173';
async function post(v,origin=base){const r=await fetch(base+'/api/state',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(v)});const raw=await r.text();let data;try{data=JSON.parse(raw)}catch{data={error:raw}}return {status:r.status,data}}
test('SQL persistence, validation, relation safety, and scoped CRUD',async()=>{const p={id:'test-'+uid(),title:"Uji SQL ' ; --",description:'Disposable integration fixture',color:'#8571e5',dueDate:''};let t,v;try{
 assert.equal((await post({action:'initialize'})).status,200);
 assert.equal((await post({action:'save',entity:'projects',value:p},'https://invalid.example')).status,403);
 assert.equal((await post({action:'save',entity:'projects',value:p})).status,200);
 t={...blankTask(p.id),title:'Uji persistensi task',status:'doing'};
 assert.equal((await post({action:'save',entity:'tasks',value:t})).status,200);
 assert.equal((await post({action:'delete',entity:'projects',id:p.id})).status,409);
 const invalid={...t,priority:'invalid'};assert.equal((await post({action:'save',entity:'tasks',value:invalid})).status,400);
 v=blankVideo(p.id,true);v.shots[1].done=true;assert.equal((await post({action:'save',entity:'videos',value:v})).status,200);
 const data=await (await fetch(base+'/api/state')).json();assert.equal(data.tasks.find(x=>x.id===t.id).title,t.title);assert.equal(videoProgress(data.videos.find(x=>x.id===v.id)),62.5);assert.equal(data.projects.find(x=>x.id===p.id).title,p.title);
 t.status='done';assert.equal((await post({action:'save',entity:'tasks',value:t})).status,200);
 const persisted=await (await fetch(base+'/api/state')).json();assert.equal(persisted.tasks.find(x=>x.id===t.id).status,'done');
}finally{if(v)await post({action:'delete',entity:'videos',id:v.id});if(t)await post({action:'delete',entity:'tasks',id:t.id});await post({action:'delete',entity:'projects',id:p.id})}});
