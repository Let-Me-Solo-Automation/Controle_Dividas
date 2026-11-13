import {CopyConfirmButton} from "./CopyConfirmButton";
import { firebaseTutorialUrl } from "../brand";
import { useEffect, useId, useState } from "react";
import {
  Check,
  Cloud,
  Eye,
  ExternalLink,
  Link,
  Lock,
  LogOut,
  RefreshCw,
} from "lucide-react";
import {
  login,
  logout,
  observeOwnerStatus,
  type OwnerIdentity,
  resetPassword,
  userError,
} from "../sharing/firebase";
import type { FirebaseGrant } from "../sharing/model";

export function FirebaseConnection() {
  const [owner, setOwner] = useState<OwnerIdentity | null>(null),
    [address, setAddress] = useState(""),
    [password, setPassword] = useState(""),
    [busy, setBusy] = useState(false),
    [checking, setChecking] = useState(true),
    [message, setMessage] = useState(""),
    [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    let alive = true;
    let unsubscribe: (() => void) | undefined;
    observeOwnerStatus((value) => {
      if (alive) {
        setOwner(value);
        setChecking(false);
      }
    })
      .then((stop) => {
        if (alive) unsubscribe = stop;
        else stop();
      })
      .catch((error) => {
        if (alive) {
          setUnavailable(true);
          setMessage(userError(error));
          setChecking(false);
        }
      });
    return () => {
      alive = false;
      unsubscribe?.();
    };
  }, []);
  async function submit() {
    setBusy(true);
    setMessage("");
    try {
      await login(address, password);
      setPassword("");
    } catch (error) {
      setMessage(userError(error));
    } finally {
      setBusy(false);
    }
  }
  if (checking)
    return (
      <p className="muted" role="status">
        Verificando o compartilhamento…
      </p>
    );
  return (
    <section className="firebase-connection">
      <div className="notice">
        <Cloud size={23} />
        <p>
          Compartilhe sem cadastro. Somente os dados da seção escolhida são
          publicados.
        </p>
      </div>
      {owner && (
        <div className="firebase-connected">
          <span>
            <Check size={17} />
            {owner.isAnonymous ? "Acesso salvo neste navegador" : owner.email}
          </span>
          {!owner.isAnonymous && (
            <button
              type="button"
              className="text-button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await logout();
                } catch (error) {
                  setMessage(userError(error));
                } finally {
                  setBusy(false);
                }
              }}
            >
              <LogOut size={15} />
              Sair
            </button>
          )}
        </div>
      )}
      <p className="muted">
        {owner && !owner.isAnonymous
          ? "Sua conta anterior continua gerenciando os links que publicou."
          : "Use este navegador para atualizar ou revogar seus links. Limpar os dados do navegador perde esse acesso; o backup dos acordos não o recupera."}
      </p>
      {!unavailable && (
        <details>
          <summary>Já publicava com e-mail e senha?</summary>
          <form
            className="form-stack"
            onSubmit={(event) => {
              event.preventDefault();
              void submit();
            }}
          >
            <p className="muted">
              Entre na conta anterior para gerenciar os links publicados por
              ela. Novos compartilhamentos dispensam cadastro.
            </p>
            {owner?.isAnonymous && (
              <p className="muted">
                Trocar de conta substitui o acesso deste navegador. Você perderá
                o acesso para revogar os links criados com ele.
              </p>
            )}
            <label className="field">
              <span>E-mail</span>
              <input
                aria-label="E-mail de compartilhamento"
                type="email"
                required
                autoComplete="email"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </label>
            <label className="field">
              <span>Senha</span>
              <input
                aria-label="Senha de compartilhamento"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <button type="submit" className="button full" disabled={busy}>
              {busy ? "Conectando…" : "Entrar na conta anterior"}
            </button>
            <button
              type="button"
              className="text-button"
              disabled={busy}
              onClick={async () => {
                if (!address) {
                  setMessage("Informe seu e-mail primeiro.");
                  return;
                }
                setBusy(true);
                try {
                  await resetPassword(address);
                  setMessage(
                    "Se o e-mail estiver cadastrado, você receberá as instruções de recuperação.",
                  );
                } catch (error) {
                  setMessage(userError(error));
                } finally {
                  setBusy(false);
                }
              }}
            >
              Esqueci minha senha
            </button>
          </form>
        </details>
      )}
      {unavailable && (
        <a
          href={firebaseTutorialUrl}
          target="_blank"
          rel="noreferrer"
          className="firebase-tutorial-link"
        >
          Ver tutorial de configuração do Firebase ↗
        </a>
      )}
      {message && (
        <p className="firebase-message" role={unavailable ? "status" : "alert"}>
          {message}
        </p>
      )}
      <small>
        O destinatário abre sem cadastro. O link não vence e pode ser consultado
        até você revogar o acesso.
      </small>
    </section>
  );
}
export function FirebaseSectionShare({
  title,
  grant,
  busy,
  onPublish,
  onRevoke,
  onSend,
}: {
  title: string;
  grant?: FirebaseGrant;
  busy: boolean;
  onPublish: () => void;
  onRevoke: () => void;
  onSend: (url: string) => void;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewId = useId();
  const previewUrl = new URL(
    "compartilhar.html",
    (window as any).NexoDeployment?.baseUrl ?? window.location.href,
  );
  previewUrl.hash = "s=" + grant?.id;
  return (
    <div>
      <div className="notice">
        <Lock size={23} />
        <div>
          <strong>Somente {title}</strong>
          <p>
            Parcelas, pagamentos e lançamentos deste acordo. Contas,
            comprovantes e anotações privadas ficam no aparelho.
          </p>
        </div>
      </div>
      <FirebaseConnection />
      {!grant && (
        <button
          className="button full"
          type="button"
          disabled={busy}
          onClick={onPublish}
        >
          <Cloud size={18} />
          {busy ? "Publicando…" : "Criar link sem vencimento"}
        </button>
      )}
      {grant?.provider === "firebase" && (
        <section
          className="share-link-card"
          aria-label="Gerenciar link compartilhado"
        >
          <div className="share-link-status">
            <span aria-hidden="true" />
            {grant.persistent
              ? "Ativo · sem vencimento"
              : "Link publicado · atualizar prazo"}
          </div>
          {!grant.persistent && (
            <p className="muted">
              Atualize a publicação para remover o vencimento deste link.
            </p>
          )}
          <label className="field">
            <span>Link de acompanhamento</span>
            <input
              aria-label="Link de acompanhamento"
              readOnly
              value={grant.url}
              onFocus={(e) => e.target.select()}
            />
          </label>
          <div className="share-link-actions">
            <button
              type="button"
              className="text-button"
              aria-expanded={previewOpen}
              aria-controls={previewId}
              onClick={() => setPreviewOpen((value) => !value)}
            >
              <Eye size={16} />
              {previewOpen ? "Ocultar prévia" : "Visualizar link"}
            </button>
            <a
              className="text-button"
              href={previewUrl.href}
              target="_blank"
              rel="noreferrer"
              aria-label="Abrir link compartilhado em nova aba"
            >
              <ExternalLink size={16} />
            </a>
          </div>
          {previewOpen && (
            <div id={previewId} className="share-link-preview">
              <iframe
                title="Prévia do link compartilhado"
                src={previewUrl.href}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <small>
            Última sincronização:{" "}
            {new Date(grant.syncedAt).toLocaleString("pt-BR")}. Novos pagamentos
            são sincronizados quando houver conexão e este navegador mantiver o
            acesso de publicação.
          </small>
          {grant.error && (
            <p role="alert" className="firebase-message">
              {grant.error}
            </p>
          )}
          <CopyConfirmButton value={grant.url} onFallback={onSend}/>

          <div className="share-link-footer">
            <button
              type="button"
              className="text-button"
              disabled={busy}
              onClick={onPublish}
            >
              <RefreshCw size={14} />
              Atualizar publicação
            </button>
            <button
              type="button"
              className="text-button share-revoke"
              disabled={busy}
              onClick={onRevoke}
            >
              <Lock size={14} />
              Revogar acesso
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
