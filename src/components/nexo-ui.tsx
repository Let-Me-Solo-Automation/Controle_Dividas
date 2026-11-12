import { createPortal } from "react-dom";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  animate,
  motion,
  useReducedMotion,
  useMotionValue,
  useInView,
  type HTMLMotionProps,
  type Transition,
} from "motion/react";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Folder,
  Landmark,
  Plus,
  Repeat2,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  Truck,
  Wallet,
  X,
} from "lucide-react";

export const spring = {
  type: "spring",
  stiffness: 340,
  damping: 32,
  mass: 0.85,
} as const;
type Preferences = {
  motion?: boolean;
  performanceMode?: "auto" | "balanced" | "full";
  efficient?: boolean;
  transition?: boolean;
  reveal?: boolean;
  numbers?: boolean;
  progress?: boolean;
  feedback?: boolean;
  intensity?: number;
  nav?: string;
  footerBlur?: boolean;
  blurStrength?: number;
  glassOpacity?: number;
  glass?: boolean;
  motionStyle?: string;
  chartAnimation?: string;
  chart?: "auto" | "area" | "bars" | "line" | "donut" | "horizontal";
};
const MotionPreferences = createContext<Preferences>({});
export const useMotionPreferences = () => useContext(MotionPreferences);
function preferenceTransition(
  settings: Preferences,
  reduced = false,
): Transition {
  if (reduced || settings.motion === false) return { duration: 0 };
  if (settings.motionStyle === "spring")
    return { ...spring, stiffness: 250, damping: 25 };
  if (settings.motionStyle === "snappy")
    return { type: "tween", duration: 0.2, ease: [0.22, 1, 0.36, 1] };
  if (settings.motionStyle === "quiet")
    return { type: "tween", duration: 0.16, ease: "easeOut" };
  return spring;
}
export function MotionAppRoot({
  settings,
  children,
  ...props
}: {
  settings: Preferences;
  children: ReactNode;
  className?: string;
}) {
  const preferences=useMemo(()=>({...settings,efficient:settings.performanceMode==="balanced"||(settings.performanceMode!=="full"&&typeof window!=="undefined"&&!!(window as any).MarksFiles)}),[settings]);
  return (
    <MotionPreferences.Provider value={preferences}>
      <MotionConfig
        reducedMotion={settings.motion === false ? "always" : "user"}
        transition={preferenceTransition(settings)}
      >
        <div {...props} data-performance={preferences.efficient?"balanced":"full"}>{children}</div>
      </MotionConfig>
    </MotionPreferences.Provider>
  );
}
type Icon = ComponentType<{ size?: number; strokeWidth?: number }>;
const records: [string, string, Icon][] = [
  ["entry", "Lançamento", ArrowUpRight],
  ["section", "Seção", Folder],
  ["delivery", "Entrega", Truck],
  ["goal", "Meta", Target],
  ["account", "Conta", Landmark],
  ["recurring", "Recorrência", Repeat2],
];

export function FluidNavigation({
  items,
  active,
  onNavigate,
  onCreate,
  hidden = false,
}: {
  items: [string, string, Icon][];
  active: string;
  onNavigate: (id: string) => void;
  onCreate: () => void;
  hidden?: boolean;
  settings?: Preferences;
}) {
  const controlsId = useId();
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const generation = useRef(0);
  const running = useRef<{ stop: () => void }[]>([]);
  const afterClose = useRef<(() => void) | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(active);
  const [phase, setPhase] = useState<"idle" | "selecting" | "closing">("idle");
  const preferences = useContext(MotionPreferences);
  const reduce = useReducedMotion();
  const instant = !!reduce || preferences.motion === false;
  const x = useMotionValue(4),
    y = useMotionValue(4);
  const width = useMotionValue(37),
    height = useMotionValue(37);
  const visible = !hidden && items.some(([key]) => key === active);
  function cancel() {
    generation.current++;
    running.current.forEach((control) => control.stop());
    running.current = [];
    afterClose.current = null;
    setPhase("idle");
    setExpanded(false);
  }
  useEffect(() => {
    cancel();
    setSelected(active);
  }, [active, hidden]);
  useEffect(
    () => () => {
      generation.current++;
      running.current.forEach((control) => control.stop());
    },
    [],
  );
  useLayoutEffect(() => {
    if (!expanded) return;
    const button = buttons.current.get(active);
    if (!button) return;
    x.jump(button.offsetLeft);
    y.jump(button.offsetTop);
    width.jump(button.offsetWidth);
    height.jump(button.offsetHeight);
  }, [expanded, active, x, y, width, height]);
  useEffect(() => {
    if ((!expanded && phase === "idle") || !visible) return;
    const pointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) cancel();
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        cancel();
        toggle.current?.focus();
      }
    };
    document.addEventListener("pointerdown", pointer);
    document.addEventListener("keydown", keyboard);
    return () => {
      document.removeEventListener("pointerdown", pointer);
      document.removeEventListener("keydown", keyboard);
    };
  }, [expanded, visible, phase]);
  async function select(key: string, action: () => void) {
    if (phase !== "idle") return;
    const button = buttons.current.get(key);
    if (!button) return;
    const sequence = ++generation.current;
    setSelected(key);
    setPhase("selecting");
    const transition = preferenceTransition(preferences, instant);
    const controls = [
      animate(x, button.offsetLeft, transition),
      animate(y, button.offsetTop, transition),
      animate(width, button.offsetWidth, transition),
      animate(height, button.offsetHeight, transition),
    ];
    running.current = controls;
    await Promise.all(controls);
    if (sequence !== generation.current) return;
    running.current = [];
    afterClose.current = action;
    setPhase("closing");
    setExpanded(false);
  }
  if (!visible) return null;
  return (
    <div
      ref={root}
      className={`nexo-mini-dock nav-variant-${preferences.nav ?? "capsule"}`}
      data-phase={phase}
      style={
        {
          "--nav-blur": `${preferences.footerBlur === false ? 0 : (preferences.blurStrength ?? 20)}px`,
          "--nav-glass-opacity": `${preferences.glassOpacity ?? 64}%`,
        } as React.CSSProperties
      }
    >
      <AnimatePresence
        initial={false}
        onExitComplete={() => {
          const action = afterClose.current;
          afterClose.current = null;
          setPhase("idle");
          if (action) {
            toggle.current?.focus({ preventScroll: true });
            action();
          }
        }}
      >
        {expanded && (
          <motion.nav
            id={controlsId}
            aria-label="Navegação principal"
            aria-busy={phase !== "idle"}
            className="nexo-mini-panel"
            initial={instant ? false : { opacity: 0, scale: 0.82, x: 14 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{
              opacity: 0,
              scale: 0.72,
              x: 22,
              transition: instant
                ? { duration: 0 }
                : { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
            }}
            transition={instant ? { duration: 0 } : spring}
          >
            <motion.span
              aria-hidden="true"
              className="nav-selection nexo-moving-selection"
              style={{ x, y, width, height }}
            />
            {items.map(([key, label, Icon]) => (
              <motion.button
                type="button"
                key={key}
                ref={(element) => {
                  if (element) buttons.current.set(key, element);
                  else buttons.current.delete(key);
                }}
                aria-label={label}
                title={label}
                aria-current={active === key ? "page" : undefined}
                aria-disabled={phase !== "idle"}
                className={`nexo-mini-item nav-${key} ${selected === key ? "is-active" : ""}`}
                onClick={() => void select(key, () => onNavigate(key))}
                whileTap={instant ? undefined : { scale: 0.97 }}
              >
                <Icon size={19} strokeWidth={1.8} />
              </motion.button>
            ))}
            <span className="nexo-mini-divider" aria-hidden="true" />
            <motion.button
              type="button"
              aria-label="Adicionar novo registro"
              title="Adicionar novo registro"
              ref={(element) => {
                if (element) buttons.current.set("create", element);
                else buttons.current.delete("create");
              }}
              aria-disabled={phase !== "idle"}
              className={`nexo-mini-item nexo-mini-new ${selected === "create" ? "is-active" : ""}`}
              onClick={() => void select("create", onCreate)}
              whileTap={instant ? undefined : { scale: 0.9 }}
            >
              <Plus size={19} />
            </motion.button>
          </motion.nav>
        )}
      </AnimatePresence>
      <motion.button
        ref={toggle}
        type="button"
        className="nexo-glass-plus"
        data-active={expanded && phase === "idle"}
        aria-label={expanded ? "Recolher navegação" : "Expandir navegação"}
        aria-expanded={expanded}
        aria-controls={expanded ? controlsId : undefined}
        aria-disabled={phase !== "idle"}
        onClick={() => {
          if (phase !== "idle") return;
          if (expanded) cancel();
          else {
            setSelected(active);
            setExpanded(true);
          }
        }}
        whileHover={instant ? undefined : { scale: 1.04 }}
        whileTap={instant ? undefined : { scale: 0.9 }}
      >
        <motion.span
          animate={{ rotate: expanded ? 45 : 0 }}
          transition={instant ? { duration: 0 } : spring}
        >
          <Plus size={22} strokeWidth={1.65} />
        </motion.span>
      </motion.button>
    </div>
  );
}

export function ThemeMorphToggle({
  dark,
  onToggle,
  disabled = false,
  className = "",
}: {
  dark: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const maskId = useId().replace(/:/g, "");
  const pref = useMotionPreferences(),
    reduced = useReducedMotion();
  const [visualDark, setVisualDark] = useState(dark),
    [changing, setChanging] = useState(false);
  const pending = useRef<boolean | null>(null);
  const instant = !!reduced || pref.motion === false;
  useEffect(() => {
    if (!changing) setVisualDark(dark);
  }, [dark, changing]);
  const finish = () => {
    if (pending.current === null) return;
    pending.current = null;
    onToggle();
    setChanging(false);
  };
  const transition: Transition = {
    type: "tween",
    duration: instant ? 0 : 0.38,
    ease: [0.22, 1, 0.36, 1],
  };
  return (
    <motion.button
      type="button"
      className={`theme-morph-toggle ${className}`}
      aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}
      aria-pressed={dark}
      aria-busy={changing}
      disabled={disabled}
      aria-disabled={disabled || changing}
      onClick={() => {
        if (changing) return;
        if (instant) {
          onToggle();
          return;
        }
        pending.current = !dark;
        setChanging(true);
        setVisualDark(!dark);
      }}
      whileTap={
        instant || pref.feedback === false ? undefined : { scale: 0.96 }
      }
    >
      <motion.svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        aria-hidden="true"
        initial={false}
        animate={{ rotate: visualDark ? -14 : 0 }}
        transition={transition}
      >
        <defs>
          <mask id={maskId}>
            <rect width="24" height="24" fill="white" />
            <motion.circle
              fill="black"
              r="7"
              initial={false}
              animate={{
                cx: visualDark ? 16.5 : 26,
                cy: visualDark ? 7.5 : -3,
              }}
              transition={transition}
              onAnimationComplete={finish}
            />
          </mask>
        </defs>
        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          mask={`url(#${maskId})`}
          initial={false}
          animate={{ r: visualDark ? 7.5 : 4.25 }}
          transition={transition}
        />
        <motion.g
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          initial={false}
          animate={{
            opacity: visualDark ? 0 : 1,
            scale: visualDark ? 0.6 : 1,
            rotate: visualDark ? 45 : 0,
          }}
          style={{ transformOrigin: "12px 12px" }}
          transition={transition}
        >
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </motion.g>
      </motion.svg>
      <span>{visualDark ? "Escuro" : "Claro"}</span>
    </motion.button>
  );
}

export function FluidTabs({
  tabs = [],
  defaultActive,
  onChange,
}: {
  tabs?: { id: string; label: string; icon: ReactNode }[];
  defaultActive?: string;
  onChange?: (id: string) => void;
}) {
  const [active, setActive] = useState(defaultActive ?? tabs[0]?.id);
  const id = useId();
  return (
    <LayoutGroup id={id}>
      <div className="glass flex gap-1 rounded-full p-1">
        {tabs.map((tab) => (
          <motion.button
            type="button"
            className="relative flex min-h-12 items-center gap-2 rounded-full px-3 text-sm font-semibold"
            key={tab.id}
            onClick={() => {
              setActive(tab.id);
              onChange?.(tab.id);
            }}
            aria-pressed={active === tab.id}
            whileTap={{ scale: 0.94 }}
          >
            {active === tab.id && (
              <motion.span
                layoutId="fluid-pill"
                className="nav-selection absolute inset-0 rounded-full"
                transition={spring}
              />
            )}
            <span className="relative">{tab.icon}</span>
            <span className="relative">{tab.label}</span>
          </motion.button>
        ))}
      </div>
    </LayoutGroup>
  );
}

type Tab = { id: string; label: string };
export function ContinuousTabs({
  options,
  tabs,
  value,
  defaultActiveId,
  onChange,
  label = "Período",
}: {
  options?: { value: string; label: string }[];
  tabs?: Tab[];
  value?: string;
  defaultActiveId?: string;
  onChange?: (id: string) => void;
  label?: string;
}) {
  const entries = options?.map((x) => ({ id: x.value, label: x.label })) ??
    tabs ?? [
      { id: "home", label: "Início" },
      { id: "activity", label: "Atividade" },
    ];
  const [local, setLocal] = useState(defaultActiveId ?? entries[0]?.id);
  const active = value ?? local;
  const id = useId();
  return (
    <LayoutGroup id={id}>
      <div
        role="group"
        aria-label={label}
        className="nexo-tabs relative flex gap-1 rounded-full p-1"
      >
        {entries.map((tab) => (
          <motion.button
            type="button"
            key={tab.id}
            aria-pressed={active === tab.id}
            className={`relative min-h-10 flex-1 whitespace-nowrap rounded-full px-3 text-xs font-semibold ${active === tab.id ? "selected" : ""}`}
            onClick={() => {
              setLocal(tab.id);
              onChange?.(tab.id);
            }}
            whileTap={{ scale: 0.95 }}
          >
            {active === tab.id && (
              <motion.span
                layoutId="continuous-pill"
                className="tab-selection absolute inset-0 rounded-full"
                transition={spring}
              />
            )}
            <span className="relative">{tab.label}</span>
          </motion.button>
        ))}
      </div>
    </LayoutGroup>
  );
}

const moneyFormatter=new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"});
export function AnimatedMoney({
  value,
  visible = true,
  className = "",
  fromZero = false,
  signed = false,
}: {
  value: number;
  visible?: boolean;
  className?: string;
  fromZero?: boolean;
  signed?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const preferences = useContext(MotionPreferences);
  const seen = useInView(ref, { once: !!preferences.efficient, amount: 0.1 });
  const previous = useRef(0);
  const reduce = useReducedMotion();
  const noCount =
    reduce || preferences.motion === false || preferences.numbers === false;
  const format = (v: number) => `${signed && v >= 0 ? "+" : ""}${moneyFormatter.format(Math.round(v)/100)}`;
  useEffect(() => {
    if (!visible || !ref.current) {
      previous.current = value;
      return;
    }
    if (!seen && !noCount) { previous.current = 0; ref.current.textContent = format(value); return; }
    if (noCount) {
      ref.current.textContent = format(value);
      previous.current = value;
      return;
    }
    const from = previous.current;
    previous.current = value;
    const animation = animate(from, value, {
      duration: preferences.efficient ? 0.32 : 0.65,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) { const text=format(v);if(ref.current.textContent!==text)ref.current.textContent=text; }
      },
    });
    return () => animation.stop();
  }, [value, visible, noCount, fromZero, seen, signed, preferences.efficient]);
  return (
    <span
      className={`money tabular-nums ${className}`}
      aria-label={visible ? format(value) : "Valor oculto"}
    >
      <span aria-hidden="true" ref={ref}>
        {visible ? format(fromZero && !noCount ? 0 : value) : "••••••"}
      </span>
    </span>
  );
}
export function MotionProgress({
  value = 0,
  label = "Progresso",
}: {
  value?: number;
  label?: string;
}) {
  const pref = useMotionPreferences(),
    reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null),
    seen = useInView(root, { once: !!pref.efficient, amount: 0.15 });
  const p = Math.max(0, Math.min(1, value)),
    instant = !!reduced || pref.motion === false || pref.progress === false;
  const target = instant || seen ? p : 0;
  const duration = instant
    ? 0
    : pref.motionStyle === "snappy"
      ? 0.35
      : pref.motionStyle === "quiet"
        ? 0.25
        : 0.9 * Math.min(2, Math.max(0.4, pref.intensity ?? 1));
  return (
    <div
      ref={root}
      className="progress adaptive-progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(p * 100)}
    >
      <motion.div
        initial={false}
        animate={{ scaleX: target }}
        style={{
          width: "100%",
          transformOrigin: "left",
          background: p >= 1 ? "var(--positive)" : p >= .5 ? "#d69b26" : "var(--negative)",
        }}
        transition={{ type: "tween", duration, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        aria-hidden="true"
        className="adaptive-progress-thumb"
        initial={false}
        animate={{ left: `${target * 100}%`, opacity: target > 0 ? 1 : 0 }}
        transition={{ type: "tween", duration, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

export function AnimatedProgressRing({progress=0,size=90,label,children}:{progress?:number;size?:number;label?:string;children?:ReactNode}) {
 const pref=useMotionPreferences();
 const root=useRef<HTMLDivElement>(null),seen=useInView(root,{once:!!pref.efficient,amount:.15});
 const reduce=useReducedMotion(),p=Math.max(0,Math.min(1,progress));
 const instant=!!reduce||pref.motion===false||pref.progress===false;
 const length=2*Math.PI*40;
 return <div ref={root} className="ring" style={{width:size,height:size}} role="img" aria-label={label??`${Math.round(p*100)}% concluído`}>
 <svg viewBox="0 0 96 96"><circle className="ring-track" cx="48" cy="48" r="40"/>
 <motion.circle className="ring-value" cx="48" cy="48" r="40" strokeDasharray={length} initial={false}
 animate={{strokeDashoffset:length*(1-(instant||seen?p:0))}} transition={{duration:instant?0:.9,ease:[.22,1,.36,1]}}/></svg>
 <div>{children??<strong>{Math.round(p*100)}<small>%</small></strong>}</div></div>;
}

export function MotionToggle({
  label,
  checked,
  onChange,
  description,
  day = false,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  day?: boolean;
}) {
  return (
    <div className="toggle-row">
      <span>
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={!!checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`nexo-switch ${checked ? "checked" : ""}`}
      >
        <motion.span animate={{ x: checked ? 18 : 0 }} transition={spring}>
          {day ? (checked ? "☀" : "☾") : null}
        </motion.span>
      </button>
    </div>
  );
}
const revealedContent = { opacity: 1, y: 0, filter: "blur(0px)" };
const revealEase = [0.22, 1, 0.36, 1] as const;
function revealDuration(value: number | undefined, base: number) {
  return base * Math.min(2, Math.max(0.4, value ?? 1));
}
export function MotionCard(props: HTMLMotionProps<"section">) {
  const pref = useContext(MotionPreferences), reduce = useReducedMotion();
  const efficient=!!pref.efficient;
  const disabled = pref.motion === false || pref.reveal === false || !!reduce;
  const clear = efficient ? {...revealedContent,transitionEnd:{filter:"none"}} : revealedContent;
  return <motion.section {...props}
    initial={disabled ? false : {opacity:0,y:pref.motionStyle==="quiet"?0:efficient?8:18,filter:pref.motionStyle==="quiet"?"blur(0px)":efficient?"blur(4px)":"blur(11px)"}}
    animate={disabled ? (efficient?{opacity:1,y:0,filter:"none"}:revealedContent) : undefined}
    whileInView={clear} viewport={{once:true,amount:.06}}
    transition={{duration:disabled?0:revealDuration(pref.intensity,efficient?.28:pref.motionStyle==="snappy"?.24:pref.motionStyle==="quiet"?.2:.62),ease:revealEase}}/>;
}
export function ScreenTransition(props: HTMLMotionProps<"main">) {
  const pref=useContext(MotionPreferences),reduce=useReducedMotion();
  const disabled=pref.motion===false||pref.transition===false||!!reduce;
  const efficient=!!pref.efficient;
  return <motion.main {...props}
    initial={disabled?false:efficient?{opacity:.5,y:4,filter:"none"}:{opacity:0,y:pref.motionStyle==="quiet"?0:12,filter:pref.motionStyle==="quiet"?"blur(0px)":"blur(16px)"}}
    animate={efficient?{opacity:1,y:0,filter:"none"}:revealedContent}
    exit={disabled?revealedContent:efficient?{opacity:0,y:-4,filter:"none"}:{opacity:0,y:-8,filter:"blur(7px)"}}
    transition={{duration:disabled?0:revealDuration(pref.intensity,efficient?.22:pref.motionStyle==="snappy"?.26:pref.motionStyle==="quiet"?.2:.7),ease:revealEase}}/>;
}

let modalOverflowRestore:string|null=null;
function syncModalBackground(){
 const background=document.querySelector<HTMLElement>(".app");
 const open=!!document.querySelector(".modal-backdrop");
 if(background){background.inert=open;if(open)background.setAttribute("aria-hidden","true");else background.removeAttribute("aria-hidden");}
 if(open){if(modalOverflowRestore===null)modalOverflowRestore=document.body.style.overflow;document.body.style.overflow="hidden";}
 else if(modalOverflowRestore!==null){document.body.style.overflow=modalOverflowRestore;modalOverflowRestore=null;}
}
export function AppModal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const titleId = useId();
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const old = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    syncModalBackground();
    const backgroundObserver=new MutationObserver(syncModalBackground);
    backgroundObserver.observe(document.body,{childList:true});
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close.current();
      }
      if (e.key === "Tab") {
        const list = Array.from(
          ref.current?.querySelectorAll<HTMLElement>(
            'button:not(:disabled),input:not([hidden]),select,textarea,a[href],[tabindex="0"]',
          ) ?? [],
        ).filter((x) => x.getClientRects().length);
        if (!list.length) {
          e.preventDefault();
          return;
        }
        const first = list[0],
          last = list.at(-1);
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      backgroundObserver.disconnect();
      requestAnimationFrame(syncModalBackground);
      document.removeEventListener("keydown", key);
      if (old?.isConnected && old !== document.body) old.focus();
      else
        document.querySelector<HTMLButtonElement>(".nexo-glass-plus")?.focus();
    };
  }, []);
  return createPortal(
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.section
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`modal ${wide ? "wide" : ""}`}
        initial={{ y: 60, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 40, scale: 0.98, opacity: 0 }}
        transition={spring}
      >
        <div className="modal-handle" />
        <header>
          <h2 id={titleId}>{title}</h2>
          <motion.button
            type="button"
            aria-label="Fechar"
            className="icon-button"
            onClick={onClose}
            whileTap={{ scale: 0.9 }}
          >
            <X size={21} />
          </motion.button>
        </header>
        <div className="modal-body">{children}</div>
      </motion.section>
    </motion.div>,
    document.body,
  );
}

export function CreateGrid({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <motion.div
      className="nexo-create-grid grid grid-cols-3 gap-2"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.035 } },
      }}
    >
      {records.map(([id, label, Icon]) => (
        <motion.button
          key={id}
          type="button"
          className="flex min-h-24 flex-col items-center justify-center gap-3 rounded-3xl p-3 text-sm font-semibold"
          onClick={() => onSelect(id)}
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0 },
          }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.94 }}
        >
          <span className={`record-icon record-${id}`}>
            <Icon size={24} strokeWidth={1.7} />
          </span>
          {label}
        </motion.button>
      ))}
    </motion.div>
  );
}
export function CreateNewDisclosure({
  initialOpen = false,
  onSelect,
}: {
  initialOpen?: boolean;
  onSelect?: (id: string) => void;
}) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <motion.div layout className="disclosure-panel rounded-3xl p-2">
      <button
        type="button"
        className="flex min-h-12 w-full items-center justify-between gap-2 px-3 font-semibold"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2">
          <Plus size={20} />
          Criar novo
        </span>
        {open && <X size={18} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <CreateGrid onSelect={(id) => onSelect?.(id)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

type Data = {
  entries?: { id: string; title: string; amount: number; type: string }[];
  sections?: { id: string; title: string }[];
  goals?: { id: string; title: string }[];
};
export function CommandPalette({
  onNavigate,
  onCreate,
  data = {},
}: {
  onNavigate: (id: string) => void;
  onCreate: (id: string) => void;
  data?: Data;
}) {
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const commands = [
    ...(
      [
        ["dashboard", "Visão geral", Wallet],
        ["accounts", "Contas e reserva", Landmark],
        ["entries", "Lançamentos", ArrowRight],
        ["agenda", "Agenda", CalendarDays],
        ["goals", "Metas", Target],
        ["settings", "Personalização", SlidersHorizontal],
      ] as [string, string, Icon][]
    ).map(([id, label, Icon]) => ({
      id,
      label,
      Icon,
      action: () => onNavigate(id),
    })),
    ...records.map(([id, label, Icon]) => ({
      id: "new-" + id,
      label: "Novo: " + label,
      Icon,
      action: () => onCreate(id),
    })),
    ...(data.entries ?? []).map((e) => ({
      id: e.id,
      label: e.title,
      Icon: ArrowRight,
      action: () => onNavigate("entries"),
    })),
  ];
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const filtered = commands
    .filter((c) => normalize(c.label).includes(normalize(query)))
    .slice(0, 12);
  const selectedIndex = Math.min(selected, Math.max(0, filtered.length - 1));
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => input.current?.focus(), 80);
      return () => clearTimeout(timer);
    } else {
      setQuery("");
      setSelected(0);
    }
  }, [open]);
  const run = (c: (typeof commands)[number]) => {
    setOpen(false);
    c.action();
  };
  return (
    <>
      <motion.button
        className="icon-button"
        type="button"
        aria-label="Buscar no Marks"
        title="Buscar (⌘K)"
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.9 }}
      >
        <Search size={20} />
      </motion.button>
      <AnimatePresence>
        {open && (
          <AppModal title="Buscar no Marks" onClose={() => setOpen(false)}>
            <div className="command-search flex items-center gap-3 rounded-2xl p-3">
              <Search size={20} />
              <input
                ref={input}
                role="combobox"
                aria-label="Buscar páginas e registros"
                aria-expanded="true"
                aria-controls="nexo-command-list"
                aria-activedescendant={
                  filtered[selectedIndex]
                    ? `command-${filtered[selectedIndex].id}`
                    : undefined
                }
                autoComplete="off"
                placeholder="Uma página, registro ou ação…"
                className="min-w-0 flex-1 bg-transparent outline-none"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelected((v) =>
                      filtered.length ? (v + 1) % filtered.length : 0,
                    );
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelected((v) =>
                      filtered.length
                        ? (v - 1 + filtered.length) % filtered.length
                        : 0,
                    );
                  }
                  if (e.key === "Enter" && filtered[selectedIndex]) {
                    e.preventDefault();
                    run(filtered[selectedIndex]);
                  }
                }}
              />
            </div>
            <div
              id="nexo-command-list"
              role="listbox"
              aria-label="Resultados da busca"
              className="mt-3 max-h-80 overflow-auto"
            >
              {filtered.length ? (
                filtered.map((c, i) => (
                  <button
                    type="button"
                    id={`command-${c.id}`}
                    role="option"
                    aria-selected={i === selectedIndex}
                    className={`command-result flex min-h-12 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm ${i === selectedIndex ? "selected" : ""}`}
                    key={c.id}
                    onClick={() => run(c)}
                  >
                    <c.Icon size={18} />
                    <span className="flex-1">{c.label}</span>
                    <ArrowRight size={16} />
                  </button>
                ))
              ) : (
                <p className="p-5 text-sm">Nenhum resultado para “{query}”.</p>
              )}
            </div>
            <small className="mt-4 block">
              ↑ ↓ navegar · Enter abrir · Esc fechar
            </small>
          </AppModal>
        )}
      </AnimatePresence>
    </>
  );
}

type ThemeConfig = {
  bg: string;
  button: string;
  dot: string;
  progress: string;
};
const palettes: ThemeConfig[] = [
  {
    bg: "bg-zinc-100",
    button: "bg-zinc-900",
    dot: "bg-zinc-300",
    progress: "bg-zinc-300",
  },
  {
    bg: "bg-blue-100",
    button: "bg-blue-600",
    dot: "bg-blue-300",
    progress: "bg-blue-300",
  },
  {
    bg: "bg-green-100",
    button: "bg-green-600",
    dot: "bg-green-400",
    progress: "bg-green-400",
  },
  {
    bg: "bg-yellow-100",
    button: "bg-yellow-400",
    dot: "bg-yellow-300",
    progress: "bg-yellow-300",
  },
];
export function CarouselNavigator({
  totalSlides = 4,
  autoDelay = 5000,
  themes = palettes,
  currentIndex,
  onIndexChange,
  autoPlay = false,
}: {
  totalSlides?: number;
  autoDelay?: number;
  themes?: ThemeConfig[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  autoPlay?: boolean;
}) {
  const count = Math.max(1, Math.trunc(totalSlides) || 1),
    index = ((currentIndex % count) + count) % count;
  const theme = themes.length ? themes[index % themes.length] : palettes[0];
  const reduce = useReducedMotion();
  const callback = useRef(onIndexChange);
  callback.current = onIndexChange;
  useEffect(() => {
    if (!autoPlay || reduce || count < 2) return;
    const timer = setTimeout(
      () => callback.current((index + 1) % count),
      Math.max(500, autoDelay),
    );
    return () => clearTimeout(timer);
  }, [autoPlay, autoDelay, index, count, reduce]);
  return (
    <div
      className={`carousel-navigation flex w-fit items-center gap-1 rounded-full px-2 py-1.5 ${theme.bg}`}
      aria-label="Navegação do carrossel"
    >
      <motion.button
        type="button"
        aria-label="Slide anterior"
        disabled={count < 2}
        onClick={() => onIndexChange((index - 1 + count) % count)}
        whileTap={{ scale: 0.9 }}
        className={`grid size-11 place-items-center rounded-full text-white ${theme.button}`}
      >
        <ChevronLeft size={21} />
      </motion.button>
      <div className="flex gap-2 px-2">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir para slide ${i + 1}`}
            aria-current={i === index ? "step" : undefined}
            className="grid min-h-11 place-items-center"
            onClick={() => onIndexChange(i)}
          >
            <motion.span
              layout
              transition={spring}
              className={`relative block h-2.5 overflow-hidden rounded-full ${i === index ? `w-10 ${theme.progress}` : `w-2.5 ${theme.dot}`}`}
            >
              {i === index && (
                <motion.span
                  key={index}
                  className="absolute inset-0 origin-left rounded-full bg-white"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: reduce ? 0 : autoDelay / 1000,
                    ease: "linear",
                  }}
                />
              )}
            </motion.span>
          </button>
        ))}
      </div>
      <motion.button
        type="button"
        aria-label="Próximo slide"
        disabled={count < 2}
        onClick={() => onIndexChange((index + 1) % count)}
        whileTap={{ scale: 0.9 }}
        className={`grid size-11 place-items-center rounded-full text-white ${theme.button}`}
      >
        <ChevronRight size={21} />
      </motion.button>
    </div>
  );
}

export function ContextualAIBar({
  defaultExpanded = false,
  placeholder = "O que você quer encontrar?",
  tools = [],
  musicIcon = <SlidersHorizontal size={19} />,
  sparkleIcon = <Sparkles size={19} />,
  onSubmit,
}: {
  defaultExpanded?: boolean;
  placeholder?: string;
  tools?: ReactNode[];
  musicIcon?: ReactNode;
  sparkleIcon?: ReactNode;
  onSubmit?: (query: string) => void;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded),
    [query, setQuery] = useState("");
  const id = useId();
  return (
    <LayoutGroup id={id}>
      <motion.div
        layout
        className="context-bar flex w-full items-center gap-2 overflow-hidden rounded-full p-1.5"
        transition={spring}
      >
        <div className="context-actions flex shrink-0 rounded-full p-1">
          {[false, true].map((v, i) => (
            <motion.button
              key={i}
              type="button"
              aria-label={v ? "Abrir busca contextual" : "Mostrar atalhos"}
              aria-pressed={expanded === v}
              className="relative grid size-10 place-items-center rounded-full"
              onClick={() => setExpanded(v)}
              whileTap={{ scale: 0.92 }}
            >
              {expanded === v && (
                <motion.span
                  layoutId="context-pill"
                  className="nav-selection absolute inset-0 rounded-full"
                />
              )}
              <span className="relative">{v ? sparkleIcon : musicIcon}</span>
            </motion.button>
          ))}
        </div>
        <AnimatePresence mode="popLayout" initial={false}>
          {expanded ? (
            <motion.form
              key="search"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex min-w-0 flex-1 items-center"
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim()) onSubmit?.(query.trim());
              }}
            >
              <input
                autoFocus
                aria-label={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="context-actions grid size-10 shrink-0 place-items-center rounded-full"
              >
                <ArrowRight size={19} />
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="tools"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-1 items-center justify-evenly gap-2 px-2"
            >
              {tools}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
export function DiscreteTabs({
  tabs,
  defaultTab,
  onTabChange,
}: {
  tabs: { id: string; icon: ReactNode; label: string; activeColor?: string }[];
  defaultTab?: string;
  onTabChange?: (id: string) => void;
}) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  return (
    <div className="flex justify-center gap-2">
      {tabs.map((t) => (
        <motion.button
          layout
          type="button"
          key={t.id}
          aria-label={t.label}
          aria-pressed={active === t.id}
          className={`discrete-tab flex min-h-12 items-center justify-center rounded-full px-3 ${active === t.id ? (t.activeColor ?? "text-blue-600") : ""}`}
          onClick={() => {
            setActive(t.id);
            onTabChange?.(t.id);
          }}
          whileTap={{ scale: 0.92 }}
        >
          {t.icon}
          <motion.span
            animate={{
              width: active === t.id ? "auto" : 0,
              opacity: active === t.id ? 1 : 0,
              marginLeft: active === t.id ? 8 : 0,
            }}
            className="overflow-hidden whitespace-nowrap text-sm font-semibold"
          >
            {t.label}
          </motion.span>
        </motion.button>
      ))}
    </div>
  );
}
export function BlurSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="nexo-blur-slider">
      <span>
        Desfoque <strong>{value}px</strong>
      </span>
      <input
        aria-label="Intensidade do desfoque"
        type="range"
        min={8}
        max={28}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
export function DashboardTools({
  onNavigate,
  onCreate,
}: {
  data?: Data;
  onNavigate: (id: string) => void;
  onCreate: (id: string) => void;
}) {
  return (
    <div className="dashboard-tools">
      <span className="eyebrow">SEU DINHEIRO, COM CLAREZA</span>
      <button type="button" onClick={() => onCreate("entry")}>
        <Plus size={15} />
        Novo registro
      </button>
    </div>
  );
}
