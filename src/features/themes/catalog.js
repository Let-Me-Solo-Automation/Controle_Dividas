import concepts from "./glossary.json";
const charts = ["area", "bars", "line", "donut", "horizontal"];
export const glossaryThemes = concepts.flatMap((concept, index) =>
  [false, true].map((dark) => {
    const hue = (index * 137.508) % 360;
    const id = `glossary-${index}-${dark ? "dark" : "light"}`;
    return {
      id,
      name: `${concept.name} · ${dark ? "Escuro" : "Claro"}`,
      baseId: `glossary-${index}`,
      concept: concept.name,
      category: concept.category,
      description: concept.description,
      family: "glossary",
      dark,
      font: "system-ui",
      layout: "apple",
      hero: "balance",
      chart: charts[index % charts.length],
      bg: `hsl(${hue} 18% ${dark ? 7 : 91}%)`,
      surface: `hsl(${hue} 24% ${dark ? 14 : 97}%)`,
      text: dark ? "#f5f5f7" : "#18212b",
      muted: dark ? "#bcc5d0" : "#475365",
      accent: `hsl(${hue} 62% ${dark ? 74 : 30}%)`,
      accentText: dark ? "#101820" : "#ffffff",
      line: `hsl(${hue} 15% ${dark ? 32 : 74}%)`,
      positive: dark ? "#83dca8" : "#166334",
      negative: dark ? "#ffacb4" : "#a81930",
      radius: [28, 16, 32, 24, 12][index % 5],
      pattern: /glass|acrylic|ice|water/i.test(concept.name)
        ? "glass"
        : /neumorph|soft|fabric|furry/i.test(concept.name)
          ? "soft"
          : /clay|kawaii/i.test(concept.name)
            ? "clay"
            : /paper|cardboard|cutout|brutal|swiss|blueprint/i.test(
                  concept.name,
                )
              ? "paper"
              : /metal|chrome|industrial|holo/i.test(concept.name)
                ? "metal"
                : "liquid",
      order: [
        "trend",
        "platforms",
        "goals",
        "activity",
        "sections",
        "reserve",
        "agenda",
      ],
    };
  }),
);
