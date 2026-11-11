import { BrandIcon } from "./components/BrandIcon";
import {
  installBrandIcon,
  firebaseTutorialUrl,
  projectDownloadUrl,
  htmlDownloadUrl,
} from "./brand";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  Expand,
  FolderDown,
  Monitor,
  Moon,
  MoveUpRight,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sun,
  X,
} from "lucide-react";
import domain from "./legacy/domain";
import appDocument from "./generated/app.html?raw";
import "./generated/simulator.css";

installBrandIcon();
const KEY = "nexo-simulator-v1";
function initialData() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return domain.validateData(JSON.parse(raw));
  } catch {}
  const data = domain.demoData();
  data.settings.showOnOpen = true;
  return data;
}
(window as any).NexoDeployment = { baseUrl: window.location.href };
function Simulator() {
  const [initial] = useState(initialData);
  const store = useRef(initial);
  const frame = useRef<HTMLIFrameElement>(null),
    stage = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState(store.current.settings.theme),
    [version, setVersion] = useState(0),
    [view, setView] = useState("phone"),
    [scale, setScale] = useState(0.86),
    [storage, setStorage] = useState("local"),
    [confirm, setConfirm] = useState<"demo" | "empty" | null>(null),
    [notice, setNotice] = useState(""),
    [controls, setControls] = useState(false),
    [clock, setClock] = useState("");
  const selectedTheme =
    domain.themes.find((x: any) => x.id === theme) ?? domain.themes[0];
  function save(raw: string) {
    try {
      store.current = domain.validateData(JSON.parse(raw));
      try {
        localStorage.setItem(KEY, JSON.stringify(store.current));
        setStorage("local");
      } catch {
        setStorage("memory");
      }
    } catch {
      setNotice(
        "Não foi possível validar os dados. O último estado válido foi preservado.",
      );
    }
  }
  // Bridge functions read refs, so the embedded app keeps the same storage session.
  (window as any).NexoSim = {
    getItem: (key: string) =>
      key === "nexo-v1" ? JSON.stringify(store.current) : null,
    setItem: (key: string, raw: string) => {
      if (key === "nexo-v1") save(raw);
    },
    removeItem: (key: string) => {
      if (key === "nexo-v1") save(JSON.stringify(domain.freshData()));
    },
  };
  useEffect(() => {
    try {
      const old = localStorage.getItem(KEY);
      if (old) {
        try {
          domain.validateData(JSON.parse(old));
        } catch {
          localStorage.setItem(KEY + "-recuperacao-" + Date.now(), old);
          setNotice(
            "O arquivo anterior foi preservado em uma cópia de recuperação.",
          );
        }
      }
      localStorage.setItem(KEY, JSON.stringify(store.current));
    } catch {
      setStorage("memory");
    }
  }, []);
  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    tick();
    const timer = setInterval(tick, 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const resize = () => {
      const width = stage.current?.clientWidth ?? 460;
      setScale(
        Math.max(
          0.35,
          Math.min(
            1,
            (width - 24) / 428,
            Math.max(420, window.innerHeight - 230) / 932,
          ),
        ),
      );
    };
    resize();
    const observer = new ResizeObserver(resize);
    if (stage.current) observer.observe(stage.current);
    window.addEventListener("resize", resize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [view]);
  useEffect(() => {
    const report = (e: MessageEvent) => {
      if (
        e.source !== frame.current?.contentWindow ||
        e.data?.type !== "nexo-simulator-theme"
      )
        return;
      if (domain.themes.some((t: any) => t.id === e.data.id))
        setTheme(e.data.id);
    };
    window.addEventListener("message", report);
    return () => window.removeEventListener("message", report);
  }, []);
  function changeTheme(id: string) {
    store.current.settings.theme = id;
    save(JSON.stringify(store.current));
    setTheme(id);
    setVersion((x) => x + 1);
  }
  function reset(kind: "demo" | "empty") {
    if (Object.keys(store.current.sharing.grants).length) {
      setNotice(
        "Revogue os links publicados dentro do app antes de reiniciar a prévia.",
      );
      return;
    }
    setConfirm(kind);
  }
  function applyReset() {
    const next = confirm === "demo" ? domain.demoData() : domain.freshData();
    next.settings = { ...store.current.settings };
    save(JSON.stringify(next));
    setVersion((x) => x + 1);
    setConfirm(null);
    setNotice(
      confirm === "demo"
        ? "Dados de demonstração restaurados."
        : "Prévia vazia, pronta para começar.",
    );
  }
  function backup() {
    const blob = new Blob([JSON.stringify(store.current, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = "Marks-backup.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }
  return (
    <MotionConfig reducedMotion="user">
      <div className="simulator">
        <header className="sim-header">
          <a
            className="sim-identity"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setVersion((x) => x + 1);
            }}
          >
            <BrandIcon className="sim-logo" />
            <span className="sim-wordmark">
              Marks
              <span className="sim-wordmark-divider" />
              <span className="sim-header-label">Design Studio</span>
            </span>
          </a>
          <div className="sim-header-right">
            <span className="sim-prototype-badge">
              <span />
              Protótipo interativo
            </span>
            <a
              href={projectDownloadUrl}
              download="Marks-projeto.zip"
              className="sim-small-button"
              aria-label="Baixar projeto Marks"
              title="Baixar projeto completo"
            >
              <FolderDown size={16} />
              <span>Baixar projeto</span>
            </a>
            <a
              href={htmlDownloadUrl}
              download="Marks-Simulador.html"
              className="sim-small-button"
              aria-label="Baixar HTML Marks"
              title="Baixar HTML offline"
            >
              <ArrowUpRight size={16} />
              <span>Baixar HTML</span>
            </a>
            <button
              type="button"
              className="sim-small-button"
              onClick={backup}
              aria-label="Exportar dados"
              title="Exportar dados"
            >
              <FolderDown size={16} />
              <span>Exportar dados</span>
            </button>
          </div>
        </header>
        <div className="sim-workspace">
          <aside className={`sim-controls ${controls ? "is-open" : ""}`}>
            <div className="sim-panel-title">
              <span>AMBIENTE DE VALIDAÇÃO</span>
              <span className="sim-version">02</span>
            </div>
            <h1>
              Uma nova forma
              <br />
              de sentir o Marks<span>.</span>
            </h1>
            <p className="sim-intro">
              Explore os detalhes.
              <br />
              Encontre o seu ritmo.
            </p>
            <button
              type="button"
              className="sim-mobile-toggle"
              aria-expanded={controls}
              onClick={() => setControls(!controls)}
            >
              Configurar prévia
              <ChevronDown size={16} />
            </button>
            <div className="sim-control-content">
              <div className="sim-section">
                <h2>Aparência</h2>
                <label className="sim-select-label" htmlFor="theme-select">
                  Tema do aplicativo
                </label>
                <div className="sim-select-wrap">
                  <span
                    className="sim-theme-dot"
                    style={{ background: selectedTheme.accent }}
                  />
                  <select
                    id="theme-select"
                    value={theme}
                    onChange={(e) => changeTheme(e.target.value)}
                  >
                    {domain.themes.map((t: any) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} />
                </div>
                <div className="sim-appearance-options">
                  <button
                    type="button"
                    onClick={() => changeTheme("porcelana")}
                    aria-pressed={theme === "porcelana"}
                  >
                    <Sun size={15} />
                    Claro
                  </button>
                  <button
                    type="button"
                    onClick={() => changeTheme("obsidiana")}
                    aria-pressed={theme === "obsidiana"}
                  >
                    <Moon size={15} />
                    Escuro
                  </button>
                </div>
              </div>
              <div className="sim-section">
                <h2>Visualização</h2>
                <div className="sim-view-options">
                  <button
                    type="button"
                    aria-pressed={view === "phone"}
                    onClick={() => setView("phone")}
                  >
                    <Smartphone size={17} />
                    <span>Celular</span>
                    <Check size={15} />
                  </button>
                  <button
                    type="button"
                    aria-pressed={view === "free"}
                    onClick={() => setView("free")}
                  >
                    <Monitor size={17} />
                    <span>Expandida</span>
                    <Check size={15} />
                  </button>
                </div>
                <div className="sim-inline-actions">
                  <button
                    type="button"
                    onClick={() =>
                      frame.current?.contentWindow?.dispatchEvent(
                        new Event("nexo-back"),
                      )
                    }
                  >
                    <ArrowLeft size={14} />
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={() => setVersion((x) => x + 1)}
                  >
                    <RotateCcw size={14} />
                    Início
                  </button>
                </div>
              </div>
              <div className="sim-section">
                <h2>Dados de teste</h2>
                <button
                  type="button"
                  className="sim-demo-button"
                  onClick={() => reset("demo")}
                >
                  <RotateCcw size={15} />
                  Restaurar demonstração
                </button>
                <button
                  type="button"
                  className="sim-empty-button"
                  onClick={() => reset("empty")}
                >
                  Começar com o app vazio
                  <ArrowUpRight size={15} />
                </button>
                <p className="sim-storage">
                  <span className={storage === "memory" ? "memory" : ""} />
                  {storage === "local"
                    ? "Salvo neste navegador"
                    : "Sessão em memória"}
                </p>
              </div>
            </div>
            <a
              href={firebaseTutorialUrl}
              target="_blank"
              rel="noreferrer"
              className="sim-firebase-tutorial"
            >
              Configurar o Firebase <ArrowUpRight size={14} />
            </a>
            <div className="sim-local-note">
              <ShieldCheck size={17} />
              <p>
                Seus testes ficam aqui.
                <br />
                Os dados do Android são independentes.
              </p>
            </div>
          </aside>
          <main
            ref={stage}
            className={`sim-stage ${view === "free" ? "sim-expanded" : ""}`}
          >
            <div className="sim-stage-top">
              <span className="sim-stage-label">
                <span />
                {view === "phone" ? "PRÉVIA MOBILE" : "ÁREA DE TESTE"}
              </span>
              <span className="sim-stage-size">
                {view === "phone" ? "412 × 866" : "RESPONSIVA"}
              </span>
            </div>
            <div className="sim-stage-content">
              <div
                className="sim-phone-space"
                style={
                  view === "phone"
                    ? { width: 428 * scale, height: 932 * scale }
                    : undefined
                }
              >
                <div
                  className="sim-phone"
                  style={
                    view === "phone"
                      ? { transform: `scale(${scale})` }
                      : undefined
                  }
                >
                  <div
                    className="sim-phone-screen"
                    style={
                      {
                        "--device-bg": selectedTheme.bg,
                        "--device-text": selectedTheme.text,
                      } as CSSProperties
                    }
                  >
                    <div className="sim-statusbar">
                      <span>{clock}</span>
                      <span className="sim-camera" />
                      <span className="sim-status-icons">
                        <svg
                          width="17"
                          height="11"
                          viewBox="0 0 17 11"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <rect x="0" y="7" width="3" height="4" rx="1" />
                          <rect x="4" y="5" width="3" height="6" rx="1" />
                          <rect x="8" y="2" width="3" height="9" rx="1" />
                          <rect x="12" width="3" height="11" rx="1" />
                        </svg>
                        <svg
                          width="21"
                          height="11"
                          viewBox="0 0 24 12"
                          fill="none"
                          aria-hidden="true"
                        >
                          <rect
                            x="1"
                            y="1"
                            width="19"
                            height="10"
                            rx="3"
                            stroke="currentColor"
                          />
                          <rect
                            x="3"
                            y="3"
                            width="15"
                            height="6"
                            rx="1"
                            fill="currentColor"
                          />
                          <path
                            d="M22 4v4"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </span>
                    </div>
                    <iframe
                      ref={frame}
                      key={version}
                      title="Marks — aplicativo interativo"
                      srcDoc={appDocument}
                      allow="clipboard-write"
                    />
                    <div className="sim-gesture">
                      <span />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sim-stage-bottom">
              <span className="sim-live-dot" />
              INTERAÇÕES REAIS<span>·</span>DADOS DE DEMONSTRAÇÃO
            </div>
          </main>
          <aside className="sim-notes">
            <div className="sim-notes-heading">
              <span>FEITO PARA EXPLORAR</span>
              <MoveUpRight size={18} />
            </div>
            <div className="sim-note">
              <span className="sim-note-number">01</span>
              <h3>Toque. Troque. Sinta.</h3>
              <p>
                Uma navegação que acompanha você, com transições contínuas e
                resposta a cada toque.
              </p>
              <div className="sim-mini-tabs" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="sim-note">
              <span className="sim-note-number">02</span>
              <h3>Teste com liberdade.</h3>
              <p>
                Crie uma entrega, registre uma parcela ou faça um aporte. Os
                indicadores respondem aos seus registros.
              </p>
            </div>
            <div className="sim-note">
              <span className="sim-note-number">03</span>
              <h3>Encontre o seu visual.</h3>
              <p>
                Explore os 15 temas e o laboratório de componentes em{" "}
                <strong>Menu → Personalização</strong>.
              </p>
            </div>
            <a
              className="sim-guidelines"
              href="https://www.figma.com/design/KC4WzWSfvI61wjI6R1YYn0/iOS-and-iPadOS-27--Community-?node-id=215-105157"
              target="_blank"
              rel="noreferrer"
            >
              <span>REFERÊNCIA DE DESIGN</span>
              <strong>
                Apple UI guidelines
                <ArrowUpRight size={15} />
              </strong>
            </a>
            <div className="sim-preview-note">
              <CircleHelp size={16} />
              <p>
                Prévia para validar o futuro app Android. Bloqueio, vibração e
                notificações nativas serão testados no dispositivo.
              </p>
            </div>
          </aside>
        </div>
        <footer className="sim-footer">
          <span>MARKS · SEU DINHEIRO, COM CLAREZA</span>
          <span>React · Tailwind CSS · Motion</span>
        </footer>
        <AnimatePresence>
          {confirm && (
            <motion.div
              className="sim-confirm-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ConfirmDialog
                kind={confirm}
                onCancel={() => setConfirm(null)}
                onConfirm={applyReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {notice && (
            <motion.div
              role="status"
              className="sim-notice"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              <span>{notice}</span>
              <button
                type="button"
                aria-label="Fechar aviso"
                onClick={() => setNotice("")}
              >
                <X size={17} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
function ConfirmDialog({
  kind,
  onCancel,
  onConfirm,
}: {
  kind: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      className="sim-confirm"
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onCancel();
      }}
    >
      <h2>
        {kind === "demo" ? "Restaurar demonstração?" : "Começar do zero?"}
      </h2>
      <p>
        {kind === "demo"
          ? "Os registros de teste serão substituídos pelos exemplos."
          : "Todos os registros deste simulador serão apagados."}{" "}
        Suas preferências visuais serão mantidas.
      </p>
      <div>
        <button type="button" onClick={onCancel} autoFocus>
          Cancelar
        </button>
        <button type="button" onClick={onConfirm}>
          Confirmar
        </button>
      </div>
    </dialog>
  );
}
createRoot(document.getElementById("simulator-root")!).render(<Simulator />);
