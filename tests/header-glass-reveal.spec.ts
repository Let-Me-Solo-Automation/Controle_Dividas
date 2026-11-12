import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';

test('header glass has independent saved controls, including genuine zero blur', async ({ page }) => {
 await page.goto(pathToFileURL(process.cwd() + '/dist/Marks-Simulador.html').href);
 const f = page.frameLocator('iframe[title="Marks — aplicativo interativo"]');
 const originalNavBlur = await f.locator('.nexo-mini-dock').evaluate(node => getComputedStyle(node).getPropertyValue('--nav-blur').trim());
 await f.getByRole('button', {name:'Abrir menu', exact:true}).click();
 await f.locator('.menu-list').getByRole('button', {name:'Personalização', exact:true}).click();
 const card = f.getByRole('region', {name:'Ajustar vidro do cabeçalho', exact:true});
 await card.getByLabel('Blur do cabeçalho', {exact:true}).fill('0');
 await card.getByLabel('Opacidade do cabeçalho', {exact:true}).fill('72');
 await expect(f.locator('.app-header')).toHaveCSS('backdrop-filter', 'blur(0px) saturate(1.12)');
 await expect(card.locator('.header-glass-sample')).toHaveCSS('backdrop-filter', 'blur(0px) saturate(1.12)');
 await card.getByLabel('Blur do cabeçalho', {exact:true}).fill('22');
 await expect(f.locator('.app-header')).toHaveCSS('backdrop-filter', 'blur(22px) saturate(1.12)');
 await expect(f.locator('.nexo-mini-dock').last()).toHaveCSS('--nav-blur', originalNavBlur);
 await card.getByRole('button', {name:'Salvar cabeçalho', exact:true}).click();
 await expect(card.getByRole('button', {name:'Salvo', exact:true})).toBeVisible();
 const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('nexo-simulator-v1')!).settings);
 expect(stored.headerBlurStrength).toBe(22);
 expect(stored.headerOpacity).toBe(72);
 expect(stored.blurStrength).toBe(parseFloat(originalNavBlur));
 await page.reload();
 await expect(page.frameLocator('iframe[title="Marks — aplicativo interativo"]').locator('.app-header')).toHaveCSS('backdrop-filter', 'blur(22px) saturate(1.12)');
});

test('Android card reveal keeps blur perceptible before clearing its rendering layer', async ({ page }) => {
 await page.setViewportSize({width:390,height:844});
 await page.addInitScript(() => {(window as any).MarksFiles = {saveBackup:()=>{}};});
 await page.goto(pathToFileURL(process.cwd() + '/android/app/src/main/assets/index.html').href);
 await expect(page.locator('.app')).toHaveAttribute('data-performance','balanced');
 const card = page.locator('.forecast-card');
 await expect(card).toHaveAttribute('data-reveal-duration','0.9');
 await card.evaluate(node => {
  const state = window as any;
  state.__revealSamples = [];
  let start = 0;
  const sample = () => {
   const rect = node.getBoundingClientRect();
   if(rect.top < innerHeight && rect.bottom > 0) {
    if(!start) start = performance.now();
    const filter = getComputedStyle(node).filter;
    state.__revealSamples.push({t:performance.now()-start,filter});
    if(filter === 'none') return;
   }
   requestAnimationFrame(sample);
  };
  requestAnimationFrame(sample);
 });
 await card.scrollIntoViewIfNeeded();
 await expect(card).toHaveCSS('filter','none');
 const samples = await page.evaluate(() => (window as any).__revealSamples as {t:number;filter:string}[]);
 expect(samples.some(s => s.t > 350 && parseFloat(s.filter.match(/blur\(([\d.]+)/)?.[1] || '0') > 0.1)).toBe(true);
 expect(samples.at(-1)?.filter).toBe('none');
 await expect(page.locator('.screen')).toHaveCSS('filter','none');
});
