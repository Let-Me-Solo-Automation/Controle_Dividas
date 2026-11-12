import {test,expect} from '@playwright/test';
import {pathToFileURL} from 'node:url';
const base=process.cwd()+'/dist/';
test('zero blur and chromatic edges persist and save confirms success',async({page})=>{
 await page.goto(pathToFileURL(base+'Marks-Simulador.html').href);
 const f=page.frameLocator('iframe[title="Marks — aplicativo interativo"]');
 await f.getByRole('button',{name:'Abrir menu',exact:true}).click();
 await f.locator('.menu-list').getByRole('button',{name:'Personalização',exact:true}).click();
 const card=f.getByRole('region',{name:'Ajustar vidro do menu',exact:true});
 await card.locator('input[type=range]').nth(1).fill('0');
 await card.getByLabel('Aberração cromática nas bordas internas').check();
 await expect(card.locator('.nexo-mini-dock')).toHaveAttribute('data-chromatic','true');
 await expect(card.locator('.nexo-glass-plus')).toHaveCSS('backdrop-filter','blur(0px) saturate(1.5)');
 await card.getByRole('button',{name:'Salvar vidro',exact:true}).click();
 await expect(card.getByRole('button',{name:'Salvo',exact:true})).toBeVisible();
 const data=await page.evaluate(()=>JSON.parse(localStorage.getItem('nexo-simulator-v1')!));
 expect(data.settings.blurStrength).toBe(0);expect(data.settings.chromaticEdges).toBe(true);
 await page.reload();
 await expect(f.locator('.nexo-glass-plus')).toHaveCSS('backdrop-filter','blur(0px) saturate(1.5)');
});
test('isolated stress preview contains large datasets without writing the real storage',async({page})=>{
 await page.goto(pathToFileURL(base+'Marks-Teste-Visual.html').href);
 const f=page.frameLocator('iframe[title="Marks — aplicativo interativo"]');
 await expect(f.locator('.hero')).toBeVisible();
 const result=await page.evaluate(()=>({real:localStorage.getItem('nexo-simulator-v1'),demo:JSON.parse(localStorage.getItem('marks-stress-preview-v1')!)}));
 expect(result.real).toBeNull();expect(result.demo.entries.length).toBeGreaterThan(400);expect(result.demo.goals.length).toBe(27);
});
test('paid section installment opens its private receipt controls',async({page})=>{
 await page.goto(pathToFileURL(base+'Marks-Simulador.html').href);
 const f=page.frameLocator('iframe[title="Marks — aplicativo interativo"]');
 await f.getByRole('button',{name:'Expandir navegação',exact:true}).click();
 await f.getByRole('navigation',{name:'Navegação principal',exact:true}).getByRole('button',{name:'Seções',exact:true}).click();
 await f.locator('.pin-item-open').filter({hasText:'Venda do videogame'}).first().click();
 await f.getByRole('button',{name:'Comprovante da parcela 1',exact:true}).click();
 await expect(f.getByRole('dialog').getByRole('button',{name:'Anexar comprovante',exact:true})).toBeVisible();
});
