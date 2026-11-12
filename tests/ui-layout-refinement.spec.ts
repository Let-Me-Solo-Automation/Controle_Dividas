import {test,expect} from '@playwright/test';
import {pathToFileURL} from 'node:url';

test('independent home modules have breathing space and dividers',async({page})=>{
 await page.goto(pathToFileURL(process.cwd()+'/dist/Marks-Simulador.html').href);
 const f=page.frameLocator('iframe[title="Marks — aplicativo interativo"]');
 const goals=f.getByRole('region',{name:'Progresso das metas',exact:true});
 await expect(goals).toHaveCSS('border-top-width','1px');
 expect(await goals.evaluate(e=>parseFloat(getComputedStyle(e).paddingTop))).toBeGreaterThanOrEqual(24);
 const modules=f.locator('.dashboard-module');
 expect(await modules.count()).toBeGreaterThan(1);
 for(const index of [0,1]){
  await expect(modules.nth(index)).toHaveCSS('border-top-width','1px');
  expect(await modules.nth(index).evaluate(e=>parseFloat(getComputedStyle(e).paddingTop))).toBeGreaterThanOrEqual(24);
 }
 await expect(f.getByRole('region',{name:'Movimentações recentes',exact:true})).toHaveCount(1);
});

test('financial summaries fit small screens with stress data',async({page})=>{
 await page.goto(pathToFileURL(process.cwd()+'/dist/Marks-Teste-Visual.html').href);
 const iframe=page.locator('iframe[title="Marks — aplicativo interativo"]');
 await iframe.evaluate(e=>{e.style.width='320px';e.style.maxWidth='320px';});
 const f=page.frameLocator('iframe[title="Marks — aplicativo interativo"]');
 await expect(f.getByRole('heading',{name:'Indicadores',exact:true})).toBeVisible();
 await expect(f.locator('.dashboard-overview-kpis')).toHaveCSS('grid-template-columns',/^[\d.]+px$/);
 expect(await f.getByLabel('Data de referência',{exact:true}).evaluate(e=>e.clientWidth)).toBeGreaterThanOrEqual(120);
 const dimensions=await f.locator('html').evaluate(e=>({width:e.clientWidth,scroll:e.scrollWidth}));
 expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.width+1);
 const kpis=await f.locator('.dashboard-overview-kpi').evaluateAll(elements=>elements.map(e=>({width:e.clientWidth,scroll:e.scrollWidth})));
 expect(kpis.every(item=>item.scroll<=item.width+1)).toBe(true);
});

test('actual balances use positive signs and green, including reserve summaries',async({page})=>{
 await page.goto(pathToFileURL(process.cwd()+'/dist/Marks-Teste-Visual.html').href);
 const iframe=page.locator('iframe[title="Marks — aplicativo interativo"]');
 await iframe.evaluate(e=>{e.style.width='320px';e.style.maxWidth='320px';});
 const f=page.frameLocator('iframe[title="Marks — aplicativo interativo"]');
 const hero=f.locator('.hero-amount .money');
 await expect(hero).toHaveText(/^\+/);
 const heroColor=await hero.evaluate(e=>getComputedStyle(e).color.match(/[\d.]+/g)!.map(Number));
 expect(heroColor[1]).toBeGreaterThan(heroColor[0]);
 expect(heroColor[1]).toBeGreaterThan(heroColor[2]);
 const width=await f.locator('.hero-amount').evaluate(e=>({client:e.clientWidth,scroll:e.scrollWidth}));
 expect(width.scroll).toBeLessThanOrEqual(width.client+1);
 await f.getByRole('button',{name:'Abrir menu',exact:true}).click();
 await f.locator('.menu-list').getByRole('button',{name:'Contas e reserva',exact:true}).click();
 const summaries=f.locator('.reserve-summary strong');
 await expect(summaries).toHaveCount(3);
 for(let index=0;index<3;index++){
  await expect(summaries.nth(index)).toHaveText(/^\+/);
  const color=await summaries.nth(index).evaluate(e=>getComputedStyle(e).color.match(/[\d.]+/g)!.map(Number));
  expect(color[1]).toBeGreaterThan(color[0]);expect(color[1]).toBeGreaterThan(color[2]);
 }
});
