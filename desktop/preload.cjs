const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('tandaiDesktop',{getVersion:()=>ipcRenderer.invoke('app-version'),notify:(title)=>ipcRenderer.send('notify',String(title)),checkUpdates:()=>ipcRenderer.invoke('check-updates'),installUpdate:()=>ipcRenderer.invoke('install-update')});
