import { curatedThemes } from "./apple-themes.js";

export const motionStyles = [
  {
    id: "smooth",
    name: "Fluido",
    description: "Entradas leves e deslocamentos contínuos.",
  },
  {
    id: "spring",
    name: "Elástico",
    description: "Molas delicadas com retorno natural.",
  },
  { id: "snappy", name: "Preciso", description: "Respostas curtas e diretas." },
  {
    id: "quiet",
    name: "Discreto",
    description: "Pequenas dissoluções, sem deslocamento.",
  },
];
export const chartAnimations = [
  {
    id: "draw",
    name: "Desenhar",
    description: "Traça a evolução do início ao fim.",
  },
  {
    id: "grow",
    name: "Crescer",
    description: "Os valores se elevam a partir da base.",
  },
  {
    id: "stagger",
    name: "Em sequência",
    description: "Cada ponto entra no seu tempo.",
  },
  {
    id: "none",
    name: "Sem animação",
    description: "Leitura imediata dos valores.",
  },
];
export const navStyles = [
  ["capsule", "Cápsula"],
  ["dock", "Dock"],
  ["island", "Ilha"],
  ["centered", "Central"],
  ["minimal", "Minimal"],
  ["elevated", "Elevada"],
];
export const personalizationDefaults = {
  theme: "apple-system",
  motion: true,
  transition: true,
  reveal: true,
  numbers: true,
  progress: true,
  feedback: true,
  glow: false,
  haptic: true,
  glass: true,
  texture: false,
  compact: false,
  nav: "capsule",
  footerBlur: true,
  blurStrength: 20,
  glassOpacity: 64,
  menuStyle: "popover",
  switchStyle: "soft",
  buttonStyle: "solid",
  cardStyle: "theme",
  calendarStyle: "classic",
  iconStyle: "outline",
  chart: "auto",
  intensity: 1,
  motionStyle: "smooth",
  chartAnimation: "draw",
};
const enums = {
  theme: curatedThemes.map((theme) => theme.id),
  chart: ["auto", "area", "bars", "line"],
  nav: navStyles.map(([id]) => id),
  motionStyle: motionStyles.map((style) => style.id),
  chartAnimation: chartAnimations.map((animation) => animation.id),
  menuStyle: ["popover", "drawer", "compact"],
  switchStyle: ["soft", "sculpted", "daynight", "glass"],
  buttonStyle: ["solid", "raised", "glass", "orbital"],
  cardStyle: ["theme", "soft", "glass", "outline", "textured"],
  calendarStyle: ["classic", "rings"],
  iconStyle: ["outline", "duotone"],
};
// A preset contains visual preferences only, never accounts, amounts, credentials,
// sharing links, hero images, notification preferences or nested presets.
export function visualSettings(settings = {}) {
  const result = {};
  for (const [key, fallback] of Object.entries(personalizationDefaults)) {
    const value = settings[key];
    result[key] = enums[key]
      ? enums[key].includes(value)
        ? value
        : fallback
      : typeof fallback === "boolean"
        ? typeof value === "boolean"
          ? value
          : fallback
        : typeof value === "number" && Number.isFinite(value)
          ? value
          : fallback;
  }
  result.intensity = Math.min(2, Math.max(0.4, result.intensity));
  result.blurStrength = Math.min(28, Math.max(8, result.blurStrength));
  result.glassOpacity = Math.min(95, Math.max(35, result.glassOpacity));
  return result;
}
export function normalizePersonalizationSettings(settings = {}) {
  const safe =
    settings && typeof settings === "object" && !Array.isArray(settings)
      ? settings
      : {};
  const seen = new Set();
  const customPresets = (
    Array.isArray(safe.customPresets) ? safe.customPresets : []
  )
    .slice(0, 20)
    .filter(
      (preset) =>
        preset &&
        typeof preset.id === "string" &&
        preset.id.length <= 100 &&
        !seen.has(preset.id) &&
        (seen.add(preset.id), true) &&
        typeof preset.name === "string" &&
        preset.name.trim(),
    )
    .map((preset) => ({
      id: preset.id,
      name: preset.name.trim().slice(0, 48),
      settings: visualSettings(preset.settings),
    }));
  return { ...safe, ...visualSettings(safe), customPresets };
}
export function motionTransition(settings = {}, reduced = false) {
  if (reduced || settings.motion === false) return { duration: 0 };
  const rhythm = Math.min(2, Math.max(0.4, Number(settings.intensity) || 1));
  if (settings.motionStyle === "spring")
    return { type: "spring", stiffness: 210 / rhythm, damping: 21 };
  return {
    type: "tween",
    duration:
      (settings.motionStyle === "snappy"
        ? 0.22
        : settings.motionStyle === "quiet"
          ? 0.3
          : 0.56) * rhythm,
    ease: [0.22, 1, 0.36, 1],
  };
}
