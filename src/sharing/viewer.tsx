import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  Link2,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { watchShare, userError } from "./firebase";
import { schedule, type SharedSection } from "./model";
import "./viewer.css";
const currency = (value: number) =>
  (value / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const formatDate = (value: string) =>
  new Date(value + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
function Viewer() {
  const token = new URLSearchParams(location.hash.slice(1)).get("s") ?? "";
  const [section, setSection] = useState<SharedSection | null>(null),
    [error, setError] = useState(""),
    [expires, setExpires] = useState(0),
    [active, setActive] = useState(!document.hidden),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    const visibility = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let stop: (() => void) | undefined;
    setSection(null);
    setError("");
    watchShare(
      token,
      (data, expiry) => {
        if (!cancelled) {
          setSection(data);
          setExpires(expiry);
          setError("");
        }
      },
      (e) => {
        if (!cancelled) {
          setSection(null);
          setError(userError(e));
        }
      },
    )
      .then((unsubscribe) => {
        if (cancelled) unsubscribe();
        else stop = unsubscribe;
      })
      .catch((e) => {
        if (!cancelled) setError(userError(e));
      });
    return () => {
      cancelled = true;
      stop?.();
    };
  }, [token, active, retry]);
  useEffect(() => {
    if (!expires) return;
    const check = () => {
      if (Date.now() >= expires) {
        setSection(null);
        setError("Este link expirou. Solicite um novo link ao proprietário.");
        setActive(false);
      }
    };
    check();
    const timer = setInterval(check, 30000);
    return () => clearInterval(timer);
  }, [expires]);
  let installments: ReturnType<typeof schedule> | null = null;
  if (section && section.kind !== "ledger")
    try {
      installments = schedule(section);
    } catch {
      return (
        <div className="viewer-page">
          <State
            title="Seção indisponível"
            message="Os dados desta seção não puderam ser validados."
          />
        </div>
      );
    }
  return (
    <div className="viewer-page">
      <header className="viewer-header">
        <a href="./" aria-label="Nexo início">
          <span className="viewer-logo">
            n<span />
          </span>
          <strong>nexo</strong>
        </a>
        <span>
          <ShieldCheck size={15} />
          Somente leitura
        </span>
      </header>
      <main className="viewer-content">
        {error ? (
          <State title="Acompanhamento indisponível" message={error}>
            <button
              type="button"
              className="viewer-button"
              onClick={() => setRetry((x) => x + 1)}
            >
              <RefreshCw size={16} />
              Tentar novamente
            </button>
          </State>
        ) : !section ? (
          <State
            title="Abrindo seu acompanhamento"
            message="Consultando a última publicação desta seção…"
          />
        ) : (
          <>
            <div className="viewer-title">
              <span>SEU ACORDO, COM CLAREZA</span>
              <h1>{section.title}</h1>
              <p>
                Acompanhamento compartilhado ·{" "}
                {section.kind === "receive"
                  ? "Valores a receber"
                  : section.kind === "pay"
                    ? "Valores a pagar"
                    : "Lançamentos da seção"}
              </p>
            </div>
            {installments && (
              <>
                <section className="viewer-summary">
                  <span>Saldo restante</span>
                  <strong>{currency(installments.remaining)}</strong>
                  <p>
                    {currency(installments.paid)} registrados de{" "}
                    {currency(section.total)}
                  </p>
                  <div className="viewer-progress">
                    <span
                      style={{
                        width: `${Math.min(100, installments.progress * 100)}%`,
                      }}
                    />
                  </div>
                </section>
                <section className="viewer-card">
                  <h2>
                    Cronograma <small>{section.count} parcelas previstas</small>
                  </h2>
                  {installments.rows.map((row) => (
                    <div className="viewer-installment" key={row.number}>
                      <span
                        className={`viewer-number ${row.closed ? "paid" : ""}`}
                      >
                        {row.closed ? <Check size={16} /> : row.number}
                      </span>
                      <div>
                        <strong>
                          Parcela {row.number}
                          {row.extra ? " · extra" : ""}
                        </strong>
                        <small>
                          {formatDate(row.date)}
                          {row.closed ? " · registrada" : ""}
                        </small>
                        {row.carry > 0 && (
                          <small>
                            {currency(row.carry)} seguem para a próxima
                          </small>
                        )}
                      </div>
                      <b>{currency(row.closed ? row.paid : row.due)}</b>
                    </div>
                  ))}
                </section>
              </>
            )}
            {section.entries.length > 0 && (
              <section className="viewer-card">
                <h2>Lançamentos desta seção</h2>
                {section.entries.map((entry, i) => (
                  <div className="viewer-installment" key={i}>
                    <span className="viewer-number">
                      {entry.type === "income" ? (
                        <ArrowDownLeft size={17} />
                      ) : (
                        <ArrowUpRight size={17} />
                      )}
                    </span>
                    <div>
                      <strong>{entry.title}</strong>
                      <small>{formatDate(entry.date)}</small>
                    </div>
                    <b>
                      {entry.type === "expense" ? "-" : ""}
                      {currency(entry.amount)}
                    </b>
                  </div>
                ))}
              </section>
            )}
            <div className="viewer-updated">
              <span>
                Atualizado em{" "}
                {new Date(section.updatedAt).toLocaleString("pt-BR")}
              </span>
              <button
                type="button"
                aria-label="Atualizar acompanhamento"
                onClick={() => setRetry((x) => x + 1)}
              >
                <RefreshCw size={15} />
              </button>
            </div>
            <p className="viewer-note">
              <LockKeyhole size={16} />
              Esta página permite apenas consultar a seção. Os outros dados
              financeiros do proprietário permanecem privados. Quem tiver este
              link poderá abri-lo até ele expirar ou ser revogado.
            </p>
          </>
        )}
      </main>
      <footer className="viewer-footer">
        NEXO · SEU DINHEIRO, COM CLAREZA
      </footer>
    </div>
  );
}
function State({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="viewer-state" role="status">
      <Link2 size={28} />
      <h1>{title}</h1>
      <p>{message}</p>
      {children}
    </section>
  );
}
createRoot(document.getElementById("viewer-root")!).render(<Viewer />);
