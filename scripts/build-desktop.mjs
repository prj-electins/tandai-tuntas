import {build as bundle} from 'esbuild';
import {build} from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/postcss';
import {resolve} from 'node:path';
import {mkdirSync,cpSync,writeFileSync,readFileSync} from 'node:fs';
const appMeta=JSON.parse(readFileSync('package.json'));const out=resolve('work/desktop-app');mkdirSync(out,{recursive:true});
await build({configFile:false,root:resolve('desktop/ui'),plugins:[react()],resolve:{alias:{'@':resolve('.')}},css:{postcss:{plugins:[tailwind()]}},build:{outDir:resolve(out,'ui'),emptyOutDir:true}});
await bundle({entryPoints:['desktop/server.mjs'],bundle:true,platform:'node',target:'node24',format:'cjs',outfile:resolve(out,'server.cjs'),alias:{'cloudflare:workers':resolve('desktop/env.mjs'),'@':resolve('.')}});
cpSync('desktop/icon.png',resolve(out,'icon.png'));
cpSync('desktop/main.cjs',resolve(out,'main.cjs'));cpSync('desktop/preload.cjs',resolve(out,'preload.cjs'));cpSync('drizzle',resolve(out,'migrations'),{recursive:true});
writeFileSync(resolve(out,'package.json'),JSON.stringify({name:'tandai-tuntas',version:appMeta.version,description:'Tandai Tuntas — tugas dan produksi kreatif',author:'arashy dev',main:'main.cjs',dependencies:{'electron-updater':'6.8.11'}}));
// Keep desktop dependencies small; bundle the updater while preserving Electron as an external runtime.
await bundle({entryPoints:['desktop/main.cjs'],bundle:true,platform:'node',target:'node24',format:'cjs',outfile:resolve(out,'main.cjs'),external:['electron','./server.cjs']});
const pkg=JSON.parse(readFileSync(resolve(out,'package.json')));pkg.dependencies={};writeFileSync(resolve(out,'package.json'),JSON.stringify(pkg));
if(process.env.TANDAI_UPDATE_URL){if(!process.env.TANDAI_UPDATE_URL.startsWith('https://'))throw Error('Update channel must use HTTPS');writeFileSync(resolve(out,'app-update.yml'),'provider: generic\nurl: '+JSON.stringify(process.env.TANDAI_UPDATE_URL)+'\n')}
console.log('Desktop source ready:',out);
