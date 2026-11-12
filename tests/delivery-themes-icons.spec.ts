import {test,expect} from '@playwright/test';
import {pathToFileURL} from 'node:url';
const url=pathToFileURL(process.cwd()+'/dist/Marks-Simulador.html').href;
const app=(page:any)=>page.frameLocator('iframe[title="Marks — aplicativo interativo"]');
async function deliveries(page:any){const f=app(page);await f.getByRole('button',{name:'Expandir navegação',exact:true}).click();await f.getByRole('navigation',{name:'Navegação principal',exact:true}).getByRole('button',{name:'Entregas',exact:true}).click();return f;}
async function settings(page:any){const f=app(page);await f.getByRole('button',{name:'Abrir menu',exact:true}).click();await f.locator('.menu-list').getByRole('button',{name:'Personalização',exact:true}).click();return f;}
test('platform withdrawal preserves earned revenue and linked income; weekly plan persists',async({page})=>{
 await page.goto(url);const f=await deliveries(page);
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('nexo-simulator-v1')!));
 await f.locator('.delivery-platform-card').first().getByRole('button',{name:'Ícone e programação',exact:true}).click();
 await f.getByLabel('Frequência do repasse',{exact:true}).selectOption('weekly');
 await f.getByLabel('Dia semanal',{exact:true}).selectOption('3');
 await f.getByRole('button',{name:'Salvar programação',exact:true}).click();
 await f.locator('.platform-open').first().click();
 await f.getByRole('button',{name:'Registrar retirada',exact:true}).click();
 await f.getByLabel('Valor da retirada (R$)',{exact:true}).fill('1,00');
 await f.getByRole('button',{name:'Confirmar retirada',exact:true}).click();
 const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('nexo-simulator-v1')!));
 expect(after.entries).toEqual(before.entries);expect(after.deliveries).toEqual(before.deliveries);
 expect(after.deliveryWithdrawals[0].amount).toBe(100);
 expect(after.deliveryPlatformSettings[after.platforms[0]].mode).toBe('weekly');
 await expect(f.locator('.settled-money').first()).toBeVisible();
});
test('glossary themes offer light/dark and saved favorites while Apple remains available',async({page})=>{
 await page.goto(url);const f=await settings(page);
 await f.getByLabel('Buscar estilo no glossário',{exact:true}).fill('Glassmorphism');
 const card=f.locator('.theme-library-card').first();
 await card.getByRole('button',{name:'Favoritar Glassmorphism',exact:true}).click();
 await card.getByRole('button',{name:'Escuro',exact:true}).click();
 await expect(f.locator('html')).toHaveAttribute('data-theme-family','glossary');
 await f.locator('.settings-sticky').getByRole('button',{name:'Salvar',exact:true}).click();
 await expect(f.locator('.settings-sticky').getByRole('button',{name:'Salvo',exact:true})).toBeVisible();
 const data=await page.evaluate(()=>JSON.parse(localStorage.getItem('nexo-simulator-v1')!));expect(data.settings.favoriteThemes).toContain('glossary-0');expect(data.settings.theme).toBe('glossary-0-dark');
 await page.reload();const next=await settings(page);await next.getByLabel('Buscar estilo no glossário',{exact:true}).fill('Apple');await expect(next.getByRole('button',{name:'Apple Sistema',exact:true})).toBeVisible();await expect(next.getByRole('button',{name:'Apple Claro',exact:true})).toBeVisible();await expect(next.getByRole('button',{name:'Apple Escuro',exact:true})).toBeVisible();
});
test('large uploaded icon is reduced to a contained 256 pixel image',async({page})=>{
 await page.goto(url);
 const bytes=await page.evaluate(async()=>{const c=document.createElement('canvas');c.width=1100;c.height=900;const ctx=c.getContext('2d')!,image=ctx.createImageData(1100,900);for(let i=0;i<image.data.length;i+=4){image.data[i]=Math.random()*255;image.data[i+1]=Math.random()*255;image.data[i+2]=Math.random()*255;image.data[i+3]=255;}ctx.putImageData(image,0,0);return Array.from(new Uint8Array(await(await new Promise<Blob>(r=>c.toBlob(b=>r(b!),'image/png'))).arrayBuffer()));});
 expect(bytes.length).toBeGreaterThan(256*1024);
 const f=await settings(page);await f.getByLabel('Ícone do aplicativo (ajuste automático, até 20 MB)',{exact:true}).setInputFiles({name:'large.png',mimeType:'image/png',buffer:Buffer.from(bytes)});
 const icon=f.locator('.app-icon-preview img');await expect(icon).toBeVisible();
 await expect.poll(()=>icon.evaluate(e=>(e as HTMLImageElement).naturalWidth)).toBe(256);
 expect(await icon.evaluate(e=>(e as HTMLImageElement).naturalHeight)).toBe(256);
});

test('pending delivery enters the bank only on payout, accepts unknown distance and undo restores it',async({page})=>{
 await page.goto(url);const f=await deliveries(page);
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('nexo-simulator-v1')!));
 await f.getByRole('button',{name:'Entrega',exact:true}).click();
 const dialog=f.getByRole('dialog');
 await dialog.getByLabel('Plataforma',{exact:true}).selectOption(before.platforms[0]);
 await dialog.getByLabel('Recebimento',{exact:true}).selectOption('pending');
 await dialog.getByLabel('Nome do estabelecimento',{exact:true}).fill('Entrega a receber');
 await dialog.getByLabel('Valor recebido (R$)',{exact:true}).fill('10,00');
 await dialog.getByLabel('Conta bancária',{exact:true}).selectOption('bradesco');
 await dialog.getByRole('button',{name:'Salvar',exact:true}).click();await expect(dialog).toHaveCount(0);
 const pending=await page.evaluate(()=>JSON.parse(localStorage.getItem('nexo-simulator-v1')!));
 expect(pending.entries).toEqual(before.entries);expect(pending.deliveries.at(-1).km).toBe(0);
 await f.locator('.platform-open').first().click();await f.getByRole('button',{name:'Registrar retirada',exact:true}).click();
 await f.getByLabel('Valor da retirada (R$)',{exact:true}).fill('5,00');
 await f.getByLabel('Conta que recebeu o repasse',{exact:true}).selectOption('bradesco');
 await f.getByRole('button',{name:'Confirmar retirada',exact:true}).click();
 const paid=await page.evaluate(()=>JSON.parse(localStorage.getItem('nexo-simulator-v1')!));
 expect(paid.entries).toHaveLength(before.entries.length+1);expect(paid.entries.at(-1).amount).toBe(500);expect(paid.entries.at(-1).deliveryPayoutId).toBe(paid.deliveryWithdrawals[0].id);
 await f.getByRole('button',{name:'Desfazer',exact:true}).click();
 const undone=await page.evaluate(()=>JSON.parse(localStorage.getItem('nexo-simulator-v1')!));expect(undone.entries).toEqual(before.entries);expect(undone.deliveryWithdrawals).toHaveLength(0);
});
