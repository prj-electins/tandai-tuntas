const {readFileSync,writeFileSync,mkdirSync}=require('node:fs');
const {join}=require('node:path');
const defaults={background:true,widgetVisible:false,nativeWidget:false};
function loadSettings(directory){try{return {...defaults,...JSON.parse(readFileSync(join(directory,'desktop-settings.json'),'utf8'))}}catch{return {...defaults}}}
function saveSettings(directory,value){mkdirSync(directory,{recursive:true});writeFileSync(join(directory,'desktop-settings.json'),JSON.stringify(value),{mode:0o600})}
module.exports={loadSettings,saveSettings};
