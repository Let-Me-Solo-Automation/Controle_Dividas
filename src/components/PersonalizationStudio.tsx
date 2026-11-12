import { SaveToggleButton } from "./SaveToggleButton";
import { FluidNavigation, MotionAppRoot } from "./nexo-ui";
import { useEffect, useId, useState, type CSSProperties } from "react";
import { LiquidDangerButton } from "./LiquidDangerButton";
import {
  animate,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import {
  Bell,
  CalendarDays,
  Check,
  ChartNoAxesCombined,
  Home,
  LayoutGrid,
  Menu,
  Play,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  chartAnimations,
  motionStyles,
  navStyles,
  normalizePersonalizationSettings,
  personalizationDefaults,
  motionTransition,
  visualSettings,
} from "../personalization.js";

type Settings = Record<string, any>;
type Theme = {
  id: string;
  name: string;
  description: string;
  bg: string;
  surface: string;
  text: string;
  accent: string;
  chart: string;
};
type Preset = { id: string; name: string; settings: Settings };
type Props = {
  settings: Settings;
  themes: Theme[];
  onChange: (settings: Settings) => void;
  onPersistPresets: (presets: Preset[]) => boolean | void;
  onOpenReference: () => void;
  onSaveGlass?: () => boolean;
};
const points = [
  [16, 91],
  [58, 73],
  [100, 79],
  [142, 38],
  [184, 54],
  [226, 21],
  [268, 30],
];
const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");

export function PreviewChart({
  kind = "area",
  animation = "draw",
  settings,
  replay = 0,
  small = false,
}: {
  kind?: string;
  animation?: string;
  settings: Settings;
  replay?: number;
  small?: boolean;
}) {
  const reduced = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const active = settings.motion !== false && !reduced && animation !== "none";
  const transition = motionTransition(settings, !active) as Transition;
  const grow = animation === "grow";
  if(kind==="donut") return <motion.svg key={replay} className="personal-chart" viewBox="0 0 284 120" role="img" aria-label="Exemplo de gráfico de rosca"><circle cx="142" cy="60" r="43" fill="none" stroke="var(--line)" strokeWidth="17"/>{[.5,.3,.2].map((value,index)=><motion.circle key={index} cx="142" cy="60" r="43" fill="none" stroke={["#479ce8","#35b88e","#cf78b1"][index]} strokeWidth="17" strokeDasharray={`${value*270} 270`} strokeDashoffset={-[0,.5,.8][index]*270} transform="rotate(-90 142 60)" initial={active?{opacity:0}:false} animate={{opacity:1}} transition={transition}/>)}</motion.svg>;
  if(kind==="horizontal")return <svg key={replay} className="personal-chart" viewBox="0 0 284 120" role="img" aria-label="Exemplo de barras horizontais">{[.85,.55,.7,.35].map((value,index)=><motion.rect key={index} x="16" y={12+index*26} width={250*value} height="15" rx="7" fill={["#479ce8","#35b88e","#cf78b1","#e8ae42"][index]} style={{transformOrigin:"16px center"}} initial={active?{scaleX:0}:false} animate={{scaleX:1}} transition={transition}/>)}</svg>;

  return (
    <svg
      key={`${replay}-${kind}-${animation}-${settings.motionStyle}-${settings.motion}-${settings.intensity}`}
      className={`personal-chart ${small ? "is-small" : ""}`}
      viewBox="0 0 284 120"
      role="img"
      aria-label={`Exemplo ilustrativo de gráfico de ${kind === "bars" ? "barras" : kind === "line" ? "linha" : "área"}`}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="currentColor" stopOpacity=".28" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".015" />
        </linearGradient>
      </defs>
      {[25, 65, 105].map((y) => (
        <line
          key={y}
          x1="8"
          y1={y}
          x2="278"
          y2={y}
          className="personal-chart-grid"
        />
      ))}
      {kind === "bars" ? (
        points.map(([x, y], index) => (
          <motion.rect
            key={index}
            x={x - 10}
            y={y}
            width="22"
            height={105 - y}
            rx="5"
            fill="currentColor"
            style={{ transformOrigin: `${x}px 105px` }}
            initial={active ? { scaleY: 0, opacity: 0.3 } : false}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{
              ...transition,
              delay:
                active && (animation === "stagger" || animation === "draw")
                  ? index * 0.075
                  : 0,
            }}
          />
        ))
      ) : (
        <>
          {kind === "area" && (
            <motion.path
              d={`${line} L268,105 L16,105 Z`}
              fill={`url(#${id})`}
              style={{ transformOrigin: "50% 105px" }}
              initial={active ? { opacity: 0, scaleY: grow ? 0 : 1 } : false}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={transition}
            />
          )}
          {animation === "stagger" ? (
            points
              .slice(1)
              .map(([x, y], index) => (
                <motion.path
                  key={index}
                  d={`M${points[index][0]},${points[index][1]} L${x},${y}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={active ? { pathLength: 0, opacity: 0 } : false}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    ...transition,
                    delay: active ? index * 0.11 : 0,
                  }}
                />
              ))
          ) : (
            <motion.path
              d={line}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transformOrigin: "50% 105px" }}
              initial={
                active
                  ? {
                      pathLength: grow ? 1 : 0,
                      scaleY: grow ? 0 : 1,
                      opacity: 0.4,
                    }
                  : false
              }
              animate={{ pathLength: 1, scaleY: 1, opacity: 1 }}
              transition={transition}
            />
          )}
          {points.map(([cx, cy], index) => (
            <motion.circle
              key={index}
              cx={cx}
              cy={cy}
              r="3.5"
              fill="currentColor"
              initial={active ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                ...transition,
                delay: active
                  ? index * (animation === "stagger" ? 0.11 : 0.05)
                  : 0,
              }}
            />
          ))}
        </>
      )}
      {!small && (
        <>
          <text x="15" y="119">
            SEG
          </text>
          <text x="130" y="119">
            QUI
          </text>
          <text x="249" y="119">
            DOM
          </text>
        </>
      )}
    </svg>
  );
}

function SampleNumber({
  settings,
  replay,
}: {
  settings: Settings;
  replay: number;
}) {
  const [value, setValue] = useState(720);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !settings.motion || !settings.numbers) {
      setValue(720);
      return;
    }
    const control = animate(0, 720, {
      duration: 0.75 * settings.intensity,
      ease: "easeOut",
      onUpdate: (next) => setValue(Math.round(next)),
    });
    return () => control.stop();
  }, [replay, settings.motion, settings.numbers, settings.intensity, reduced]);
  return (
    <strong aria-label="Exemplo: setecentos e vinte reais">
      R$ {value.toLocaleString("pt-BR")},00
    </strong>
  );
}

function MotionSample({
  settings,
  replay = 0,
  compact = false,
}: {
  settings: Settings;
  replay?: number;
  compact?: boolean;
}) {
  const reduced = useReducedMotion();
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    setClicked(false);
  }, [replay]);
  const active = settings.motion && !reduced;
  const transition = motionTransition(settings, !active) as Transition;
  const quiet = settings.motionStyle === "quiet";
  return (
    <motion.div
      key={`${replay}-${settings.motionStyle}-${settings.motion}`}
      className={`personal-motion-sample ${compact ? "is-compact" : ""}`}
      initial={
        active && settings.reveal
          ? {
              opacity: 0,
              y: quiet ? 0 : 16,
              scale: settings.motionStyle === "spring" ? 0.9 : 1,
            }
          : false
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={transition}
    >
      <div className="personal-sample-title">
        <span className="personal-sample-icon">
          <Sparkles size={compact ? 15 : 19} />
        </span>
        <span>
          {compact ? "Meu objetivo" : "Uma ideia ganhando forma"}
          <small>
            {compact
              ? "Meta ilustrativa"
              : "Prévia ilustrativa · valores de exemplo"}
          </small>
        </span>
      </div>
      {!compact && <SampleNumber settings={settings} replay={replay} />}
      <div className="personal-sample-progress">
        <motion.i
          initial={active && settings.progress ? { scaleX: 0 } : false}
          animate={{ scaleX: 0.72 }}
          transition={transition}
        />
      </div>
      {!compact && (
        <div className="personal-sample-bottom">
          <span>72% do objetivo</span>
          <motion.button
            type="button"
            className={`personal-demo-button ${clicked ? "is-done" : ""}`}
            whileHover={
              active && settings.feedback ? { y: -2, scale: 1.03 } : undefined
            }
            whileTap={active && settings.feedback ? { scale: 0.92 } : undefined}
            animate={
              clicked && active && settings.feedback
                ? { scale: [1, 1.08, 1] }
                : { scale: 1 }
            }
            transition={transition}
            onClick={() => {
              setClicked((value) => !value);
              if (settings.haptic) (window as any).NexoNative?.haptic();
            }}
          >
            {clicked ? <Check size={14} /> : <Plus size={14} />}{" "}
            {clicked ? "Concluído" : "Experimente tocar"}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

function ControlsPreview({
  settings,
  replay,
}: {
  settings: Settings;
  replay: number;
}) {
  const [tab, setTab] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const reduced = useReducedMotion();
  const active = settings.motion && !reduced;
  const transition = motionTransition(
    settings,
    !active || !settings.transition,
  ) as Transition;
  return (
    <div
      className="personal-controls-preview"
      style={
        {
          "--preview-blur": `${settings.footerBlur ? settings.blurStrength : 0}px`,
        } as CSSProperties
      }
    >
      <div className="personal-control-examples">
        <div className={`personal-menu-example menu-${settings.menuStyle}`}>
          <Menu size={15} />
          <span>Ações</span>
          <i />
          <i />
          <i />
        </div>
        <div
          className={`personal-calendar-example calendar-${settings.calendarStyle}`}
        >
          <CalendarDays size={15} />
          <span>
            QUI <strong>12</strong>
          </span>
        </div>
        <button
          type="button"
          className={`personal-switch-example switch-${settings.switchStyle}`}
          role="switch"
          aria-checked={enabled}
          aria-label="Experimentar interruptor de exemplo"
          onClick={() => setEnabled((value) => !value)}
        >
          <Bell size={14} />
          <span>
            <i
              style={{
                transform: enabled ? "translateX(14px)" : "translateX(0)",
              }}
            />
          </span>
        </button>
      </div>
      <div className="personal-nav-stage">
        <motion.div
          key={`${tab}-${replay}`}
          className="personal-nav-content"
          initial={
            active && settings.transition
              ? { opacity: 0, y: settings.motionStyle === "quiet" ? 0 : 8 }
              : false
          }
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
        >
          {
            ["Visão geral", "Minhas metas", "Novo registro", "Minha evolução"][
              tab
            ]
          }
          <small>Toque nos ícones para testar a transição.</small>
        </motion.div>
        <nav
          aria-label="Navegação de exemplo"
          className={`personal-nav-sample nav-${settings.nav}`}
        >
          {[Home, LayoutGrid, Plus, ChartNoAxesCombined].map((Icon, index) => (
            <motion.button
              type="button"
              key={index}
              aria-label={
                [
                  "Visão geral de exemplo",
                  "Metas de exemplo",
                  "Novo registro de exemplo",
                  "Evolução de exemplo",
                ][index]
              }
              aria-pressed={tab === index}
              whileTap={
                active && settings.feedback ? { scale: 0.85 } : undefined
              }
              transition={motionTransition(settings, !active) as Transition}
              onClick={() => setTab(index)}
            >
              <Icon size={16} />
            </motion.button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="personal-toggle">
      <span>
        {label}
        {description && <small>{description}</small>}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="personal-toggle-track" aria-hidden="true" />
    </label>
  );
}

export function PersonalizationStudio({
  settings: raw,
  onSaveGlass,
  themes,
  onChange,
  onPersistPresets,
  onOpenReference,
}: Props) {
  const settings: Settings = normalizePersonalizationSettings(raw);
  const reduced = useReducedMotion();
  const [replay, setReplay] = useState(0);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const change = (patch: Settings) => {
    onChange({ ...settings, ...patch });
    setReplay((value) => value + 1);
  };
  const theme = themes.find((item) => item.id === settings.theme) || themes[0];
  const chart =
    settings.chart === "auto" ? theme?.chart || "area" : settings.chart;
  const persist = (presets: Preset[]) => {
    if (onPersistPresets(presets) === false) {
      setMessage(
        "Não foi possível salvar. Confira o aviso do aplicativo e tente novamente.",
      );
      return false;
    }
    onChange({ ...settings, customPresets: presets });
    return true;
  };
  const savePreset = () => {
    const title = name.trim().slice(0, 48);
    if (!title) {
      setMessage("Dê um nome à sua combinação.");
      return;
    }
    const presets: Preset[] = settings.customPresets;
    const existing = presets.find(
      (item) => item.name.toLocaleLowerCase() === title.toLocaleLowerCase(),
    );
    if (!existing && presets.length >= 20) {
      setMessage("Você já tem 20 combinações. Exclua uma para criar outra.");
      return;
    }
    const next = {
      id: existing?.id || crypto.randomUUID(),
      name: title,
      settings: visualSettings(settings),
    };
    if (
      !persist(
        existing
          ? presets.map((item) => (item.id === existing.id ? next : item))
          : [...presets, next],
      )
    )
      return;
    setName("");
    setMessage(
      existing
        ? "Combinação atualizada e salva neste aparelho."
        : "Combinação salva neste aparelho.",
    );
  };
  const reset = () => {
    change({
      ...personalizationDefaults,
      theme: settings.theme,
      customPresets: settings.customPresets,
    });
    setMessage(
      "Padrão restaurado. Tema, privacidade e combinações salvas foram preservados.",
    );
  };
  const styleFields: [string, string, [string, string][]][] = [
    [
      "menuStyle",
      "Menu de ações",
      [
        ["popover", "Flutuante"],
        ["drawer", "Gaveta"],
        ["compact", "Barra de ícones"],
      ],
    ],
    [
      "switchStyle",
      "Interruptores",
      [
        ["soft", "Suave"],
        ["sculpted", "Esculpido"],
        ["daynight", "Dia e noite"],
        ["glass", "Vidro"],
      ],
    ],
    [
      "buttonStyle",
      "Botões",
      [
        ["solid", "Sólido"],
        ["raised", "Relevo"],
        ["glass", "Vidro"],
        ["orbital", "Orbital"],
      ],
    ],
    [
      "cardStyle",
      "Cartões",
      [
        ["theme", "Do tema"],
        ["soft", "Suave"],
        ["glass", "Vidro"],
        ["outline", "Contorno"],
        ["textured", "Textura"],
      ],
    ],
    [
      "calendarStyle",
      "Calendário",
      [
        ["classic", "Clássico"],
        ["rings", "Anéis"],
      ],
    ],
    [
      "iconStyle",
      "Ícones",
      [
        ["outline", "Traço fino"],
        ["duotone", "Duotone"],
      ],
    ],
  ];
  return (
    <div className="personalization-studio">
      <section
        className="personal-section"
        aria-labelledby="personal-theme-title"
      >
        <div className="personal-section-heading">
          <div>
            <span className="personal-eyebrow">SEU ESPAÇO, SEU RITMO</span>
            <h2 id="personal-theme-title">Escolha sua aparência</h2>
          </div>
          <button
            type="button"
            className="personal-subtle-button"
            onClick={reset}
          >
            <RotateCcw size={15} /> Restaurar padrão
          </button>
        </div>
        <div className="personal-default-actions"><button type="button" className="personal-subtle-button" onClick={() => {const preset={id:"marks-default",name:"Meu padrão Marks",settings:visualSettings(settings)};persist([...settings.customPresets.filter((item: Preset)=>item.id!==preset.id),preset]);setMessage("Seu padrão foi salvo neste aparelho.");}}>Salvar este visual como meu padrão</button><button type="button" className="personal-subtle-button" onClick={() => {const preset=settings.customPresets.find((item: Preset)=>item.id==="marks-default");if(preset)change(preset.settings);else reset();}}>Aplicar meu padrão</button></div>
        <p className="personal-muted">
          Cada escolha aparece no aplicativo enquanto você experimenta. Salve no
          topo quando terminar.
        </p>
        <div className="personal-theme-grid">
          {themes.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`personal-theme-card ${settings.theme === item.id ? "is-selected" : ""}`}
              aria-pressed={settings.theme === item.id}
              onClick={() => change({ theme: item.id })}
              style={
                {
                  "--sample-bg": item.bg,
                  "--sample-surface": item.surface,
                  "--sample-text": item.text,
                  "--sample-accent": item.accent,
                } as CSSProperties
              }
            >
              <div
                className={`personal-theme-art ${item.id === "apple-system" ? "is-system" : ""}`}
              >
                <span />
                <i />
                <div>
                  <b />
                  <b />
                  <b />
                  <b />
                  <b />
                </div>
                <em />
              </div>
              <strong>
                {item.name}
                {settings.theme === item.id && <Check size={15} />}
              </strong>
              <small>{item.description}</small>
            </button>
          ))}
        </div>
      </section>

      <section
        className="personal-section"
        aria-labelledby="personal-preview-title"
      >
        <div className="personal-section-heading">
          <div>
            <span className="personal-eyebrow">VEJA ACONTECER</span>
            <h2 id="personal-preview-title">Sua combinação em movimento</h2>
          </div>
          <button
            type="button"
            className="personal-replay-button"
            onClick={() => setReplay((value) => value + 1)}
          >
            <Play size={15} /> Repetir prévia
          </button>
        </div>
        <p className="personal-muted">
          Amostras visuais de exemplo. Toque no botão da meta para sentir a
          resposta escolhida.
        </p>
        {(reduced || !settings.motion) && (
          <p className="personal-motion-note" role="status">
            {reduced
              ? "Movimento reduzido do aparelho ativo: as prévias mostram a versão estática."
              : "Animações desativadas: as prévias mostram o estado final."}
          </p>
        )}
        <div className="personal-live-preview">
          <div className="personal-preview-chart">
            <span>
              Evolução ilustrativa <ChartNoAxesCombined size={16} />
            </span>
            <PreviewChart
              settings={settings}
              kind={chart}
              animation={settings.chartAnimation}
              replay={replay}
            />
          </div>
          <MotionSample settings={settings} replay={replay} />
        </div>
        <ControlsPreview settings={settings} replay={replay} />
        <div className="personal-preview-footer">
          <span>
            {
              motionStyles.find((item) => item.id === settings.motionStyle)
                ?.name
            }{" "}
            ·{" "}
            {
              chartAnimations.find(
                (item) => item.id === settings.chartAnimation,
              )?.name
            }
          </span>
          <button type="button" onClick={onOpenReference}>
            Explorar interações
          </button>
        </div>
      </section>

      <section
        className="personal-section"
        aria-labelledby="personal-charts-title"
      >
        <div className="personal-section-heading">
          <div>
            <span className="personal-eyebrow">DADOS COM CLAREZA</span>
            <h2 id="personal-charts-title">Gráficos do painel</h2>
          </div>
        </div>
        <p className="personal-muted">
          O formato e a animação escolhidos também são aplicados aos gráficos
          reais do painel.
        </p>
        <div className="personal-chart-types">
          {[
            ["auto", "Do tema"],
            ["area", "Área"],
            ["bars", "Barras"],
            ["line", "Linha"],
            ["donut", "Rosca"],
            ["horizontal", "Barras horizontais"],
          ].map(([id, label]) => (
            <button
              type="button"
              key={id}
              className={`personal-choice ${settings.chart === id ? "is-selected" : ""}`}
              aria-label={label}
              aria-pressed={settings.chart === id}
              onClick={() => change({ chart: id })}
            >
              <PreviewChart
                kind={id === "auto" ? theme?.chart : id}
                animation={settings.chartAnimation}
                settings={settings}
                replay={replay}
                small
              />
              <strong>
                {label}
                {settings.chart === id && <Check size={14} />}
              </strong>
            </button>
          ))}
        </div>
        <h3 className="personal-control-heading">Como os gráficos entram</h3>
        <div className="personal-animation-grid">
          {chartAnimations.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`personal-choice ${settings.chartAnimation === item.id ? "is-selected" : ""}`}
              aria-pressed={settings.chartAnimation === item.id}
              onClick={() => change({ chartAnimation: item.id })}
            >
              <PreviewChart
                kind={chart}
                animation={item.id}
                settings={settings}
                replay={replay}
                small
              />
              <strong>
                {item.name}
                {settings.chartAnimation === item.id && <Check size={14} />}
              </strong>
              <small>{item.description}</small>
            </button>
          ))}
        </div>
      </section>

      <section
        className="personal-section"
        aria-labelledby="personal-motion-title"
      >
        <div className="personal-section-heading">
          <div>
            <span className="personal-eyebrow">MISTURE OS DETALHES</span>
            <h2 id="personal-motion-title">Movimento e microinterações</h2>
          </div>
        </div>
        <Toggle
          label="Ativar animações"
          description="A preferência de movimento reduzido do aparelho tem prioridade."
          checked={settings.motion}
          onChange={(value) => change({ motion: value })}
        />
        <div className="personal-motion-grid">
          {motionStyles.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`personal-choice ${settings.motionStyle === item.id ? "is-selected" : ""}`}
              aria-pressed={settings.motionStyle === item.id}
              onClick={() => change({ motionStyle: item.id })}
            >
              <MotionSample
                settings={{ ...settings, motionStyle: item.id }}
                replay={replay}
                compact
              />
              <strong>
                {item.name}
                {settings.motionStyle === item.id && <Check size={14} />}
              </strong>
              <small>{item.description}</small>
            </button>
          ))}
        </div>
        <div className="personal-toggle-grid">
          {[
            ["transition", "Transições entre telas"],
            ["reveal", "Revelar conteúdo ao rolar"],
            ["numbers", "Animar os valores"],
            ["progress", "Animar barras e anéis"],
            ["feedback", "Resposta ao tocar"],
            ["glow", "Brilho dos controles"],
            ["haptic", "Vibrar ao salvar"],
          ].map(([id, label]) => (
            <Toggle
              key={id}
              label={label}
              checked={settings[id]}
              onChange={(value) => change({ [id]: value })}
            />
          ))}
        </div>
        <label className="personal-range">
          <span>
            Ritmo das animações{" "}
            <strong>{settings.intensity.toFixed(1)}×</strong>
          </span>
          <input
            type="range"
            min="0.4"
            max="2"
            step="0.1"
            value={settings.intensity}
            onChange={(event) =>
              change({ intensity: Number(event.target.value) })
            }
          />
          <small>
            Mais rápido <span>Mais suave</span>
          </small>
        </label>
      </section>

      <section
        className="personal-section"
        aria-labelledby="personal-nav-title"
      >
        <div className="personal-section-heading">
          <div>
            <span className="personal-eyebrow">SEMPRE POR PERTO</span>
            <h2 id="personal-nav-title">Navegação flutuante</h2>
          </div>
        </div>
        <div className="personal-nav-grid">
          {navStyles.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`personal-choice ${settings.nav === id ? "is-selected" : ""}`}
              aria-pressed={settings.nav === id}
              onClick={() => change({ nav: id })}
            >
              <span className={`personal-nav-sample nav-${id}`}>
                <i>
                  <Home size={13} />
                </i>
                <i>
                  <LayoutGrid size={13} />
                </i>
                <i>
                  <Plus size={13} />
                </i>
                <i>
                  <ChartNoAxesCombined size={13} />
                </i>
              </span>
              <strong>
                {label}
                {settings.nav === id && <Check size={14} />}
              </strong>
            </button>
          ))}
        </div>
        <section className="glass-tuning-card" aria-label="Ajustar vidro do menu">
          <h3>Vidro do menu flutuante</h3>
          <p className="personal-muted">Role o conteúdo da prévia e toque no + para expandir o menu.</p>
          <MotionAppRoot settings={settings} className="glass-live-preview">
            <div className="glass-preview-scroll" tabIndex={0} aria-label="Conteúdo para testar o vidro">
              {[0,1,2].map(index => <div className="glass-preview-scene" key={index}>
                <div className="glass-color-samples"><span /><span /><span /><span /></div>
                <h4>{["Seu dinheiro", "Suas metas", "Movimentações"][index]}</h4>
                <strong className="positive-text">+ R$ 2.450,00</strong>
                <p>Texto sobre uma superfície colorida para observar o contraste e o desfoque.</p>
                <svg viewBox="0 0 300 100" role="img" aria-label="Gráfico colorido de exemplo"><path d="M0 90 Q40 10 80 50 T160 35 T240 20 L300 0 L300 100 L0 100Z" fill="#469ce833"/><path d="M0 90 Q40 10 80 50 T160 35 T240 20 L300 0" fill="none" stroke="#469ce8" strokeWidth="5"/><path d="M0 70 Q60 85 100 35 T200 55 T300 25" fill="none" stroke="#e48c67" strokeWidth="5"/></svg>
              </div>)}
            </div>
            <FluidNavigation items={[["home","Início",Home],["goals","Metas",LayoutGrid],["chart","Gráficos",ChartNoAxesCombined]]} active="home" onNavigate={() => {}} onCreate={() => {}} />
          </MotionAppRoot>
          <label className="personal-range"><span>Opacidade do vidro <strong>{settings.glassOpacity}%</strong></span><input type="range" min="35" max="95" step="1" value={settings.glassOpacity} onChange={event => change({glassOpacity:Number(event.target.value)})}/></label>
          <p className="personal-muted">Menor opacidade revela mais cores ao fundo. Maior opacidade destaca os ícones.</p>
        <Toggle
          label="Blur sob a navegação"
          checked={settings.footerBlur}
          onChange={(value) => change({ footerBlur: value })}
        />
        <label className="personal-range">
          <span>
            Intensidade do blur <strong>{settings.blurStrength}px</strong>
          </span>
          <input
            type="range"
            min="0"
            max="28"
            step="1"
            value={settings.blurStrength}
            onChange={(event) =>
              change({ blurStrength: Number(event.target.value) })
            }
          />
        </label>
          {onSaveGlass && <SaveToggleButton label="Salvar vidro" revision={`${settings.glassOpacity}-${settings.blurStrength}-${settings.footerBlur}`} onSave={onSaveGlass} />}
        </section>
        <details className="personal-details">
          <summary>Superfícies e controles</summary>
          <div className="personal-fields">
            {styleFields.map(([id, label, options]) => (
              <label key={id}>
                <span>{label}</span>
                <select
                  value={settings[id]}
                  onChange={(event) => change({ [id]: event.target.value })}
                >
                  {options.map(([value, text]) => (
                    <option key={value} value={value}>
                      {text}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <div className="personal-toggle-grid">
            {[
              ["glass", "Superfícies de vidro"],
              ["texture", "Texturas sutis"],
              ["compact", "Layout compacto"],
            ].map(([id, label]) => (
              <Toggle
                key={id}
                label={label}
                checked={settings[id]}
                onChange={(value) => change({ [id]: value })}
              />
            ))}
          </div>
        </details>
      </section>

      <section
        className="personal-section"
        aria-labelledby="personal-presets-title"
      >
        <div className="personal-section-heading">
          <div>
            <span className="personal-eyebrow">GUARDE SUA ASSINATURA</span>
            <h2 id="personal-presets-title">Suas combinações</h2>
          </div>
          <span className="personal-count">
            {settings.customPresets.length}/20
          </span>
        </div>
        <p className="personal-muted">
          Salve tema, gráficos, navegação e movimento com um nome. As
          combinações ficam neste aparelho.
        </p>
        <form
          className="personal-preset-form"
          onSubmit={(event) => {
            event.preventDefault();
            savePreset();
          }}
        >
          <label className="sr-only" htmlFor="personal-preset-name">
            Nome da combinação
          </label>
          <input
            id="personal-preset-name"
            maxLength={48}
            placeholder="Ex.: Meu ritmo de trabalho"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button type="submit" className="personal-replay-button">
            <Save size={15} /> Salvar combinação
          </button>
        </form>
        {settings.customPresets.length > 0 && (
          <div className="personal-preset-list">
            {settings.customPresets.map((preset: Preset) => (
              <div className="personal-preset" key={preset.id}>
                <span>
                  <strong>{preset.name}</strong>
                  <small>
                    {themes.find((item) => item.id === preset.settings.theme)
                      ?.name || "Apple Sistema"}{" "}
                    ·{" "}
                    {
                      motionStyles.find(
                        (item) => item.id === preset.settings.motionStyle,
                      )?.name
                    }
                  </small>
                </span>
                <button
                  type="button"
                  className="personal-subtle-button"
                  onClick={() => {
                    change(preset.settings);
                    setMessage(
                      `Combinação “${preset.name}” aplicada à prévia. Salve no topo para manter.`,
                    );
                  }}
                >
                  Aplicar
                </button>
                <LiquidDangerButton
                  className="personal-icon-button"
                  aria-label={`Excluir combinação ${preset.name}`}
                  onClick={() => {
                    if (
                      persist(
                        settings.customPresets.filter(
                          (item: Preset) => item.id !== preset.id,
                        ),
                      )
                    )
                      setMessage("Combinação excluída.");
                  }}
                >
                  <Trash2 size={16} />
                </LiquidDangerButton>
              </div>
            ))}
          </div>
        )}
        <p className="personal-status" role="status" aria-live="polite">
          {message}
        </p>
      </section>
    </div>
  );
}
