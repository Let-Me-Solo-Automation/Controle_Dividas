import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {zipSync,strToU8} from 'fflate';

export async function createViewerArchive() {
 const files={};
 for(const path of [
  'Visualizador.html','Abrir-Visualizador.command',
  'dist/Marks-Simulador.html','dist/Marks-Metas-Demo.html',
  'dist/Marks-Teste-Visual.html','dist/Marks-Vazio-Demo.html',
  'dist/compartilhar.html','dist/tutorial-firebase.html',
  'dist/firebase-config.json','dist/marks-icon.png',
 ]) {
  files['Marks-Visualizador/'+path]=[new Uint8Array(await readFile(path)),{
   level:6,os:3,attrs:((path.endsWith('.command')?0o100755:0o100644)<<16)>>>0,
  }];
 }
 files['Marks-Visualizador/LEIA-ME.txt']=[strToU8(`VISUALIZAR O MARKS\n\n1. Extraia o ZIP inteiro no computador.\n2. Abra Visualizador.html com Safari, Chrome, Edge ou Firefox.\n3. No Mac, você também pode abrir Abrir-Visualizador.command para iniciar no Safari.\n\nNão é preciso instalar Node, npm ou iniciar um servidor.\nMantenha a pasta dist ao lado do HTML para trocar entre os cenários.\nO GitHub permite baixar os arquivos, mas não executa a simulação na página do repositório.\n\nSe aparecer código, use Abrir com > Safari ou Google Chrome no arquivo extraído.\nSe o macOS bloquear o .command, abra diretamente o HTML no navegador.\n`),{level:6,os:3,attrs:(0o100644<<16)>>>0}];
 await mkdir('entregas',{recursive:true});
 const output='entregas/Marks-Visualizador.zip';
 await writeFile(output,zipSync(files));
 console.log(`Visualizador pronto: ${output}`);
 return output;
}
