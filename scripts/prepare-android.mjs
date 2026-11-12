import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
await mkdir('android/app/src/main/assets',{recursive:true});
const downloadBridge=`<script>window.NexoDeployment={baseUrl:"https://let-me-solo-automation.github.io/Controle_Dividas/"};(()=>{const original=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){if(this.download&&this.href.startsWith("blob:")&&window.MarksFiles){fetch(this.href).then(r=>r.blob()).then(blob=>{const reader=new FileReader();reader.onload=()=>MarksFiles.saveBackup(String(reader.result).split(",")[1]);reader.readAsDataURL(blob);});return;}return original.call(this);};})();</script>`;
const html=await readFile('src/generated/app.html','utf8');
await writeFile('android/app/src/main/assets/index.html',html.replace('<script>',downloadBridge+'<script>'));
await copyFile('public/firebase-config.json','android/app/src/main/assets/firebase-config.json');
