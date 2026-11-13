import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {unzipSync} from 'fflate';

test('Figma archive keeps every individual file below 1 MB and split modules stay interactive',async({page})=>{
 const zipBytes=new Uint8Array(await readFile('entregas/Marks-Figma.zip'));
 expect(zipBytes.byteLength).toBeLessThan(1_000_000);
 const archive=unzipSync(zipBytes);
 for(const [name,bytes] of Object.entries(archive))expect(bytes.byteLength,name).toBeLessThan(1_000_000);
 expect(archive['modules/app.js'].byteLength).toBeLessThan(20_000);
 const root=path.resolve('output/Marks-Figma');
 const server=http.createServer(async(req,res)=>{try{const pathname=new URL(req.url!,'http://localhost').pathname;const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep))throw Error();const bytes=await readFile(file);res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.json')?'application/json':'text/html');res.end(bytes);}catch{res.writeHead(404);res.end();}});
 await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+(server.address() as any).port;
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 try{
  await page.goto(base);
  await expect(page.getByRole('heading',{name:'Visão geral',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Expandir navegação',exact:true}).click();
  await page.getByRole('navigation',{name:'Navegação principal',exact:true}).getByRole('button',{name:'Entregas',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Desempenho das entregas',exact:true})).toBeVisible();
  await page.locator('.platform-open').first().click();
  await expect(page.getByRole('button',{name:'Registrar retirada',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Abrir menu',exact:true}).click();
  await page.locator('.menu-list').getByRole('button',{name:'Personalização',exact:true}).click();
  await expect(page.getByLabel('Buscar estilo no glossário',{exact:true})).toBeVisible();
  await page.goto(base+'/compartilhar.html');
  await expect(page.locator('#viewer-root')).not.toBeEmpty();
  expect(errors).toEqual([]);
 }finally{await page.goto('about:blank');await new Promise<void>(resolve=>server.close(()=>resolve()));}
});
