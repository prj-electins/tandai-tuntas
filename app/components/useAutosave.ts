'use client';
import {useEffect,useRef,useState} from 'react';
import {useApp} from './App';
import {projectSchema,taskSchema,videoSchema} from '@/lib/model';
const schemas={projects:projectSchema,tasks:taskSchema,videos:videoSchema};
export function draftKey(scope:string,entity:string,id:string){return 'tandai.draft.'+scope+'.'+entity+'.'+id}
export function readDraft<T>(scope:string,entity:string,value:T&{id:string}):T{try{const raw=localStorage.getItem(draftKey(scope,entity,value.id));return raw?JSON.parse(raw).value:value}catch{return value}}
export function useAutosave<T extends {id:string}>(entity:keyof typeof schemas,value:T,initial:T){const {workspaceId,save,setDirty}=useApp(),[lastSaved,setLastSaved]=useState(JSON.stringify(initial)),[status,setStatus]=useState('');const valueRef=useRef(value),saveRef=useRef(save);valueRef.current=value;saveRef.current=save;const key=draftKey(workspaceId,entity,value.id),serialized=JSON.stringify(value),writing=useRef(false);const clear=()=>{try{localStorage.removeItem(key)}catch{}};
 useEffect(()=>{setDirty(serialized!==lastSaved);return()=>setDirty(false)},[serialized,lastSaved,setDirty]);
 useEffect(()=>{if(serialized===lastSaved){clear();return}const persist=()=>{try{localStorage.setItem(key,JSON.stringify({entity,value:valueRef.current,at:Date.now()}))}catch{setStatus('Penyimpanan draf penuh. Simpan perubahan sekarang.')}};persist();const timer=setTimeout(async()=>{if(writing.current)return;const parsed=schemas[entity].safeParse(valueRef.current);if(!parsed.success){setStatus('Draf disimpan di perangkat. Lengkapi judul untuk menyimpan.');return}writing.current=true;setStatus('Menyimpan otomatis…');const snapshot=JSON.stringify(valueRef.current);try{if(await saveRef.current(entity,parsed.data as any)){setLastSaved(snapshot);setStatus('Tersimpan otomatis')}else setStatus('Belum tersimpan. Draf tetap ada di perangkat ini.')}finally{writing.current=false}},1000);return()=>clearTimeout(timer)},[serialized,lastSaved,key]);
 return {lastSaved,status,clear,dirty:serialized!==lastSaved};}
