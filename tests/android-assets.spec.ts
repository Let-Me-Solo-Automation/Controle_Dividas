import {test,expect} from '@playwright/test';
import {pathToFileURL} from 'node:url';
test('Android embedded app starts empty and exports JSON through its file bridge',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(()=>{(window as any).MarksFiles={saveBackup:(encoded:string)=>{(window as any).__export=encoded;}};});
 await page.goto(pathToFileURL(process.cwd()+'/android/app/src/main/assets/index.html').href);
 await expect(page.getByRole('heading',{name:'Visão geral',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Cadastrar minha primeira conta',exact:true})).toBeVisible();
 await page.evaluate(()=>{const anchor=document.createElement('a');anchor.href=URL.createObjectURL(new Blob([JSON.stringify({marks:'backup'})],{type:'application/json'}));anchor.download='Marks-backup.json';anchor.click();});
 await expect.poll(()=>page.evaluate(()=>(window as any).__export)).toBeTruthy();
 expect(await page.evaluate(()=>JSON.parse(atob((window as any).__export)))).toEqual({marks:'backup'});
 expect(errors).toEqual([]);
});
