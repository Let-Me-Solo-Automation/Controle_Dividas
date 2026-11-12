import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {unzipSync} from 'fflate';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const archive=unzipSync(new Uint8Array(await readFile('dist/downloads/Marks-projeto.zip')));
for(const path of ['Marks/Visualizador.html','Marks/PROJETO-MARKS.md','Marks/package.json','Marks/package-lock.json','Marks/Marks-Android.apk','Marks/android/app/src/main/AndroidManifest.xml','Marks/android/app/src/main/java/app/marks/finance/MainActivity.java','Marks/scripts/build-android.sh','Marks/dist/Marks-Teste-Visual.html','Marks/dist/Marks-Vazio-Demo.html'])if(!archive[path])throw Error('Arquivo ausente: '+path);
for(const path of Object.keys(archive))if(/\.(jks|keystore)$|\/password\.txt$|\/\.signing\//i.test(path))throw Error('Arquivo privado incluído: '+path);
const apk=await readFile('output/Marks-Android.apk');
if(hash(apk)!==hash(archive['Marks/Marks-Android.apk']))throw Error('APK desatualizado no ZIP.');
const raw=Buffer.from(apk);
let end=raw.length-22;while(end>=Math.max(0,raw.length-65557)&&raw.readUInt32LE(end)!==0x06054b50)end--;
if(end<0||raw.readUInt32LE(end)!==0x06054b50)throw Error('Diretório ZIP do APK não encontrado.');
let central=raw.readUInt32LE(end+16),resourceChecked=false;
for(let index=0;index<raw.readUInt16LE(end+10);index++){
 if(raw.readUInt32LE(central)!==0x02014b50)throw Error('Diretório ZIP inválido.');
 const length=raw.readUInt16LE(central+28),extra=raw.readUInt16LE(central+30),comment=raw.readUInt16LE(central+32);
 const name=raw.subarray(central+46,central+46+length).toString();
 if(name==='resources.arsc'){
  if(raw.readUInt16LE(central+10)!==0)throw Error('resources.arsc comprimido: APK incompatível com Android 11+.');
  const local=raw.readUInt32LE(central+42),offset=local+30+raw.readUInt16LE(local+26)+raw.readUInt16LE(local+28);
  if(offset%4!==0)throw Error('resources.arsc desalinhado.');resourceChecked=true;
 }
 central+=46+length+extra+comment;
}
if(!resourceChecked)throw Error('resources.arsc ausente.');
const contents=unzipSync(new Uint8Array(apk));
for(const file of ['AndroidManifest.xml','classes.dex','assets/index.html','assets/firebase-config.json'])if(!contents[file])throw Error('APK incompleto: '+file);
if(hash(contents['assets/index.html'])!==hash(await readFile('android/app/src/main/assets/index.html')))throw Error('App do APK difere do build preparado.');
const viewer=await readFile('Visualizador.html');if(viewer.length<100000||hash(viewer)!==hash(archive['Marks/Visualizador.html']))throw Error('Visualizador incompleto/desatualizado.');
console.log('Entrega verificada: HTML autônomo, código/documentação, APK atual e ausência de chaves privadas no ZIP público.');
