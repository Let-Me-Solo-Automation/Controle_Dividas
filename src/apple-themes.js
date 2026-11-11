// Shared visual definitions for the app and Studio; no financial data or effects.
export const systemFontStack = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const common = {
  family: 'apple', font: 'system-ui', layout: 'apple', hero: 'balance', chart: 'area',
  order: ['trend', 'goals', 'sections', 'platforms', 'reserve', 'agenda', 'activity'],
};
const light = {
  ...common, id: 'apple-light', name: 'Apple Claro',
  description: 'Superfícies claras, controles de vidro e leitura precisa.',
  bg: '#f2f2f7', surface: '#ffffff', text: '#1c1c1e', muted: '#54545c',
  accent: '#0066cc', accentText: '#ffffff', line: '#d1d1d6',
  positive: '#18703c', negative: '#b42332', dark: false,
};
const dark = {
  ...common, id: 'apple-dark', name: 'Apple Escuro',
  description: 'Profundidade escura, conteúdo legível e luz discreta.',
  bg: '#000000', surface: '#1c1c1e', text: '#f5f5f7', muted: '#b8b8c0',
  accent: '#409cff', accentText: '#001d3d', line: '#48484a',
  positive: '#73d49a', negative: '#ff9aa4', dark: true,
};
export const appleThemes = [
  light, dark,
  { ...light, id: 'apple-system', name: 'Apple Sistema', description: 'A mesma identidade, acompanhando o claro ou escuro do aparelho.' },
];

export function resolveAppleTheme(id, systemDark) {
  if (id === 'apple-system') return systemDark ? dark : light;
  return appleThemes.find((theme) => theme.id === id);
}
