import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {zipSync} from 'fflate';
import {build} from 'esbuild';
import path from 'node:path';
const limit=1_000_000;
const bundled=await build({entryPoints:['src/legacy/domain.js'],bundle:true,platform:'node',format:'esm',write:false});
const {default:domain}=await import('data:text/javascript;base64,'+Buffer.from(bundled.outputFiles[0].text).toString('base64'));
const demo=domain.demoData();demo.settings.showOnOpen=true;
const root='output/Marks-Figma';await rm(root,{recursive:true,force:true});await mkdir(root+'/modules',{recursive:true});
await writeFile('output/Marks-Figma-entry.ts',`if(!localStorage.getItem('marks-figma-review-v1'))localStorage.setItem('marks-figma-review-v1',${JSON.stringify(JSON.stringify(demo))});\nawait import('../src/app-entry.tsx');\n`);
const output=await build({entryPoints:{app:'output/Marks-Figma-entry.ts',shared:'src/sharing/viewer.tsx'},bundle:true,format:'esm',splitting:true,write:false,outdir:root+'/modules',minify:true,platform:'browser',target:['safari16','chrome110'],jsx:'automatic',loader:{'.png':'dataurl'},define:{'process.env.NODE_ENV':'"production"'},legalComments:'eof'});
const files={};
async function add(name,bytes){
 const data=typeof bytes==='string'?Buffer.from(bytes):bytes;
 if(data.byteLength>=limit)throw Error(`${name} excede o limite: ${data.byteLength} bytes`);
 await writeFile(root+'/'+name,data);
 files[name]=[new Uint8Array(data),{level:9,os:3,attrs:(0o100644<<16)>>>0}];
}
for(const file of output.outputFiles)await add(path.relative(path.resolve(root),file.path),file.text.replaceAll('nexo-v1','marks-figma-review-v1'));
const html=await readFile('src/generated/app.html','utf8');
// These font families only belonged to retired themes; no active screen uses them.
const style=html.match(/<style>([\s\S]*?)<\/style>/)[1].replace(/@font-face\s*\{[^{}]*\}/g,block=>/font-family:\s*(?:Lora|IBM Plex Mono)\s*;/.test(block)?'':block);
await add('styles.css',style);
function page(title,css,script){return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#f2f2f7"><title>${title}</title><link rel="stylesheet" href="${css}"></head><body><div id="root"></div><script type="module" src="${script}"></script></body></html>`;}
await add('index.html',page('Marks — revisão interativa','styles.css','modules/app.js'));
await add('compartilhar.html',page('Marks — link compartilhado','modules/shared.css','modules/shared.js').replace('id="root"','id="viewer-root"'));
await add('firebase-config.json',await readFile('public/firebase-config.json'));
await add('tutorial-firebase.html',await readFile('dist/tutorial-firebase.html'));
await add('LEIA-ME.md',`# Marks no Figma\n\nImporte o ZIP inteiro como projeto, mantendo os caminhos. Cada arquivo é menor que 1.000.000 bytes. Os módulos JS são carregados por demanda, sem cortar código ou recursos.\n\nEsta exportação usa módulos JavaScript e precisa de HTTP/HTTPS, como o ambiente de prévia do Figma. Para testar localmente, nesta pasta execute python3 -m http.server 8765 e abra http://localhost:8765. Abrir index.html por file:// pode ser bloqueado pelo navegador. Para abrir diretamente sem servidor, use o pacote separado Marks-Visualizador.zip.\n\nDados de demonstração isolados em marks-figma-review-v1. Não contém registros pessoais. O ZIP completo pode ser maior que 1 MB; o limite é aplicado a cada arquivo individual.\n`);
const sizes=Object.entries(files).map(([name,[bytes]])=>({name,bytes:bytes.byteLength}));
await add('TAMANHOS.json',JSON.stringify({limitBytes:limit,files:sizes},null,2));
await mkdir('entregas',{recursive:true});await writeFile('entregas/Marks-Figma.zip',zipSync(files));
console.log(JSON.stringify({files:sizes.length,maxBytes:Math.max(...sizes.map(f=>f.bytes)),maxJSBytes:Math.max(...sizes.filter(f=>f.name.endsWith('.js')).map(f=>f.bytes)),htmlBytes:files['index.html'][0].byteLength}));
