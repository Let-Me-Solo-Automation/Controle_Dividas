import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';

test('settings have one menu entry and money privacy remains available without device lock', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(pathToFileURL(process.cwd() + '/dist/Marks-Simulador.html').href);
  const app = page.frameLocator('iframe[title="Marks — aplicativo interativo"]');
  await expect(app.getByRole('heading', { name: 'Visão geral', exact: true })).toBeVisible();
  await expect(app.locator('.screen-heading .avatar')).toHaveCount(0);
  await app.getByRole('button', { name: 'Abrir menu', exact: true }).click();
  await expect(app.getByRole('button', { name: 'Bloquear agora', exact: true })).toHaveCount(0);
  await app.locator('.menu-list').getByRole('button', { name: 'Personalização', exact: true }).click();
  await expect(app.getByText('Bloquear com credencial do aparelho', { exact: true })).toHaveCount(0);
  await expect(app.getByText('Mostrar valores ao abrir', { exact: true })).toBeVisible();
  await app.getByRole('button', { name: 'Abrir menu', exact: true }).click();
  await app.locator('.menu-list').getByRole('button', { name: 'Lançamentos', exact: true }).click();
  const privacy = app.getByRole('button', { name: 'Mostrar ou ocultar valores', exact: true });
  await expect(privacy).toBeVisible();
  await privacy.click();
  expect(errors).toEqual([]);
});
