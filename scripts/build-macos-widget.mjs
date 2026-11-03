import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
if(process.platform!=='darwin')throw Error('Widget macOS harus dibangun di Mac.');
const run=(cmd,args)=>execFileSync(cmd,args,{encoding:'utf8',stdio:['pipe','pipe','pipe']});
const identity=process.env.TANDAI_WIDGET_SIGN_IDENTITY;
const team=process.env.TANDAI_APPLE_TEAM_ID;
if(!identity||!team||!/^[A-Z0-9]{10}$/.test(team))throw Error('Isi TANDAI_WIDGET_SIGN_IDENTITY dan TANDAI_APPLE_TEAM_ID untuk membangun widget bertanda tangan.');
const version=JSON.parse(readFileSync('package.json','utf8')).version,group=team+'.app.tandai.tuntas';
const root=resolve('work/native-widget'),extension=join(root,'TandaiTasks.appex'),contents=join(extension,'Contents'),bin=join(contents,'MacOS');mkdirSync(bin,{recursive:true});
const plist=value=>'<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0">'+value+'</plist>';
for(const name of ['TasksWidget','WidgetBridge']){const source=readFileSync('desktop/macos/'+name+'.swift','utf8').replaceAll('TANDAI_GROUP_ID',group);writeFileSync(join(root,name+'.swift'),source);run('xcrun',['swiftc',...(name==='TasksWidget'?['-parse-as-library','-application-extension','-Xlinker','-e','-Xlinker','_NSExtensionMain']:[]),'-target','arm64-apple-macos14.0','-framework','SwiftUI','-framework','WidgetKit',join(root,name+'.swift'),'-o',name==='TasksWidget'?join(bin,'TandaiTasks'):join(root,'WidgetBridge')]);}
writeFileSync(join(contents,'Info.plist'),plist(`<dict><key>CFBundleIdentifier</key><string>app.tandai.tuntas.TasksWidget</string><key>CFBundleName</key><string>Tandai Tuntas</string><key>CFBundleDisplayName</key><string>Tandai Tuntas</string><key>CFBundleExecutable</key><string>TandaiTasks</string><key>CFBundlePackageType</key><string>XPC!</string><key>CFBundleShortVersionString</key><string>${version}</string><key>CFBundleVersion</key><string>${version}</string><key>LSMinimumSystemVersion</key><string>14.0</string><key>NSExtension</key><dict><key>NSExtensionPointIdentifier</key><string>com.apple.widgetkit-extension</string><key>NSExtensionAttributes</key><dict><key>NSExtensionPointVersion</key><string>3.0</string></dict></dict></dict>`));
const groupXML=`<key>com.apple.security.application-groups</key><array><string>${group}</string></array>`;
writeFileSync(join(root,'widget.entitlements'),plist('<dict><key>com.apple.security.app-sandbox</key><true/>'+groupXML+'</dict>'));writeFileSync(join(root,'bridge.entitlements'),plist('<dict>'+groupXML+'</dict>'));
run('codesign',['--force','--sign',identity,'--identifier','app.tandai.tuntas.WidgetBridge','--entitlements',join(root,'bridge.entitlements'),join(root,'WidgetBridge')]);
run('codesign',['--force','--sign',identity,'--entitlements',join(root,'widget.entitlements'),extension]);
run('codesign',['--verify','--strict',extension]);console.log('Widget macOS compiled and signed:',extension);
