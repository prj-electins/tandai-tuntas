import {scryptAsync} from '@noble/hashes/scrypt.js';
const hex=(v:Uint8Array)=>Array.from(v,n=>n.toString(16).padStart(2,'0')).join('');
export async function hashPassword(password:string){const salt=crypto.getRandomValues(new Uint8Array(16));const hash=await scryptAsync(password,salt,{N:16384,r:8,p:5,dkLen:32,maxmem:32*1024*1024});return `scrypt:16384:8:5:${hex(salt)}:${hex(hash)}`;}
export async function verifyPassword(password:string,stored:string){const [algorithm,n,r,p,salt,expected]=stored.split(':');if(algorithm!=='scrypt'||n!=='16384'||r!=='8'||p!=='5'||!salt||!expected)return false;const bytes=Uint8Array.from(salt.match(/.{2}/g)!,h=>parseInt(h,16));const actual=await scryptAsync(password,bytes,{N:16384,r:8,p:5,dkLen:32,maxmem:32*1024*1024});const result=hex(actual);let diff=result.length^expected.length;for(let i=0;i<result.length;i++)diff|=result.charCodeAt(i)^(expected.charCodeAt(i)||0);return diff===0;}
export async function tokenHash(token:string){return hex(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token))));}
export function randomToken(){return hex(crypto.getRandomValues(new Uint8Array(32)));}
