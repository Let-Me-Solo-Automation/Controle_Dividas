import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {zipSync,strToU8} from 'fflate';
const {version}=JSON.parse(await readFile('package.json','utf8'));
const apk=new Uint8Array(await readFile('Marks-Android.apk'));
const sha=createHash('sha256').update(apk).digest('hex');
const command=(await readFile('Instalar-no-A52.command','utf8')).replace(/MARKS_EXPECTED_SHA="[a-f0-9]+"/,`MARKS_EXPECTED_SHA="${sha}"`).replace(/\b2\.\d+\.\d+\b/g,version);
await writeFile('Instalar-no-A52.command',command,{mode:0o755});
const file=(bytes,mode=0o100644)=>[bytes,{level:6,os:3,attrs:(mode<<16)>>>0}];
await mkdir('entregas',{recursive:true});
await writeFile('entregas/Instalar-Marks-no-Mac.zip',zipSync({
 'Instalar-Marks/Instalar-no-A52.command':file(strToU8(command),0o100755),
 'Instalar-Marks/Marks-Android.apk':file(apk),
 'Instalar-Marks/LEIA-ME.txt':file(strToU8(`Marks ${version}\n\nExtraia esta pasta no Mac. Mantenha os dois arquivos juntos.\nAbra Instalar-no-A52.command. O IP fixo é 192.168.18.121.\nInforme somente a porta de pareamento e o código de seis dígitos mostrado no A52.\nDepois informe a porta de conexão da tela principal de Depuração sem fio.\nA porta de pareamento e a de conexão podem ser diferentes.\nSe o macOS bloquear, clique com o botão direito e escolha Abrir.\nO instalador atualiza sem desinstalar e verifica a integridade do APK.\nSHA256: ${sha}\n`))
}));
console.log(`Instalador Mac ${version} gerado; SHA256 ${sha}`);
