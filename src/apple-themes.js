import { glossaryThemes } from "./features/themes/catalog.js";
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

// The picker is deliberately small. Older IDs are migrated by the preferences
// model; their financial data and other saved settings remain untouched.
const baseThemes = [
  appleThemes[2], light, dark,
  {
    ...common, id: 'obsidiana', name: 'Obsidiana', family: 'obsidiana',
    description: 'OLED, números com neon discreto e respostas ao toque.',
    bg: '#080a0e', surface: '#171b22', text: '#f0f3fa', muted: '#a5b0c2',
    accent: '#a9e9c6', accentText: '#10271b', line: '#343c49',
    positive: '#91e4b8', negative: '#ff9cac', dark: true,
    font: 'Space Grotesk', layout: 'oled', hero: 'cashflow', chart: 'bars',
    order: ['platforms', 'trend', 'sections', 'activity', 'goals', 'reserve', 'agenda'],
  },
  {
    ...common, id: 'rubi', name: 'Rubi', family: 'rubi',
    description: 'Bordô profundo, luz suave e leitura acolhedora.',
    bg: '#24151c', surface: '#39222d', text: '#fff0f4', muted: '#d6b4c3',
    accent: '#ffb3c6', accentText: '#492333', line: '#684352',
    positive: '#a3e4bb', negative: '#ffb7a4', dark: true,
    font: 'Manrope', layout: 'velvet', hero: 'agenda', chart: 'area',
    order: ['agenda', 'sections', 'trend', 'activity', 'goals', 'reserve', 'platforms'],
  },
];

export const curatedThemes = [...baseThemes, ...baseThemes.filter(theme=>theme.id==='obsidiana'||theme.id==='rubi').map(theme=>({...theme,id:theme.id+'-light',name:theme.name+' Claro',dark:false,bg:theme.id==='rubi'?'#eee2e7':'#e5e9ed',surface:theme.id==='rubi'?'#faf0f4':'#f5f7fa',text:'#20242c',muted:'#505966',line:'#b2bac4',accent:theme.id==='rubi'?'#923250':'#216048',accentText:'#ffffff',positive:'#166334',negative:'#a81930'})), ...glossaryThemes];

export function resolveAppleTheme(id, systemDark) {
  if (id === 'apple-system') return systemDark ? dark : light;
  return appleThemes.find((theme) => theme.id === id);
}
