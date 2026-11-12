import { useState } from "react";
import { Star, Shuffle } from "lucide-react";
export function ThemeLibrary({
  themes,
  settings,
  onChange,
}: {
  themes: any[];
  settings: any;
  onChange: (next: any) => void;
}) {
  const [query, setQuery] = useState(""),
    [favorites, setFavorites] = useState(false),
    [limit, setLimit] = useState(12);
  const saved: string[] = Array.isArray(settings.favoriteThemes)
    ? settings.favoriteThemes
    : [];
  const bases = themes.filter(
    (t) =>
      t.id.startsWith("apple") ||
      (t.baseId ? !t.dark : ["rubi", "obsidiana"].includes(t.id)),
  );
  const filtered = bases.filter(
    (t) =>
      (!favorites || saved.includes(t.baseId || t.id)) &&
      `${t.name} ${t.category || ""} ${t.description || ""}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()),
  );
  const select = (t: any, dark: boolean) => {
    if (t.id.startsWith("apple")) {
      onChange({ theme: t.id });
      return;
    }
    const candidate = t.baseId
      ? themes.find((x) => x.baseId === t.baseId && x.dark === dark)
      : themes.find(
          (x) =>
            x.id ===
            (dark
              ? t.id.replace("-light", "")
              : t.id.replace("-light", "") + "-light"),
        );
    if (candidate) onChange({ theme: candidate.id, chart: "auto" });
  };
  return (
    <div className="theme-library">
      <p>
        Apple é o padrão preservado. As outras propostas têm versões clara e
        escura. Conceitos experimentais são adaptados para manter a leitura e o
        desempenho.
      </p>
      <label className="field">
        <span>Buscar estilo no glossário</span>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(12);
          }}
          placeholder="Ex.: vidro, paper, neon"
        />
      </label>
      <div className="theme-library-actions">
        <button
          type="button"
          aria-pressed={favorites}
          onClick={() => setFavorites(!favorites)}
        >
          <Star size={16} />
          Favoritos
        </button>
        <button
          type="button"
          onClick={() => {
            const candidates = themes.filter((t) => t.family === "glossary");
            const t = candidates[Math.floor(Math.random() * candidates.length)];
            onChange({
              theme: t.id,
              chart: ["area", "bars", "line", "donut", "horizontal"][
                Math.floor(Math.random() * 5)
              ],
              cardStyle: ["theme", "soft", "outline"][
                Math.floor(Math.random() * 3)
              ],
              motionStyle: "smooth",
            });
          }}
        >
          <Shuffle size={16} />
          Misturar e gerar visual
        </button>
      </div>
      <p role="status">
        {filtered.length} propostas · salve o conjunto para reutilizar a
        mistura.
      </p>
      <div className="personal-theme-grid">
        {filtered.slice(0, limit).map((t) => (
          <article
            key={t.id}
            className="theme-library-card"
            style={{
              background: t.surface,
              color: t.text,
              borderColor: t.line,
            }}
          >
            <div className="theme-library-heading">
              <strong>{t.concept || t.name}</strong>
              <button
                type="button"
                aria-label={`Favoritar ${t.concept || t.name}`}
                aria-pressed={saved.includes(t.baseId || t.id)}
                onClick={() => {
                  const id = t.baseId || t.id;
                  onChange({
                    favoriteThemes: saved.includes(id)
                      ? saved.filter((x) => x !== id)
                      : [...saved, id],
                  });
                }}
              >
                <Star
                  size={18}
                  fill={
                    saved.includes(t.baseId || t.id) ? "currentColor" : "none"
                  }
                />
              </button>
            </div>
            <div
              className="theme-mini-sample"
              style={{ background: t.bg, borderRadius: t.radius || 20 }}
            >
              <i style={{ background: t.accent }} />
              <span>Saldo</span>
              <b style={{ color: t.positive }}>+ R$ 1.240,00</b>
              <svg viewBox="0 0 120 25" aria-hidden="true">
                <path
                  d="M0 22L20 15L40 18L65 5L85 12L120 2"
                  stroke={t.accent}
                  fill="none"
                  strokeWidth="3"
                />
              </svg>
            </div>
            <small>{t.category || t.description}</small>
            <div className="theme-library-actions">
              {t.id.startsWith("apple") ? (
                <button
                  type="button"
                  aria-pressed={settings.theme === t.id}
                  onClick={() => select(t, t.dark)}
                >
                  {t.name}
                </button>
              ) : (
                [false, true].map((d) => (
                  <button
                    key={String(d)}
                    type="button"
                    aria-pressed={
                      settings.theme ===
                      (t.baseId
                        ? `${t.baseId}-${d ? "dark" : "light"}`
                        : t.id.replace("-light", "") + (d ? "" : "-light"))
                    }
                    onClick={() => select(t, d)}
                  >
                    {d ? "Escuro" : "Claro"}
                  </button>
                ))
              )}
            </div>
          </article>
        ))}
      </div>
      {filtered.length > limit && (
        <button type="button" onClick={() => setLimit(limit + 12)}>
          Mostrar mais estilos
        </button>
      )}
    </div>
  );
}
