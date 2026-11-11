import { firebaseTutorialUrl } from "../brand";
import { useEffect, useState } from "react";
import { Check, Cloud, Link, Lock, LogOut, RefreshCw } from "lucide-react";
import {
  login,
  logout,
  ownerStatus,
  resetPassword,
  userError,
} from "../sharing/firebase";
import type { FirebaseGrant } from "../sharing/model";

export function FirebaseConnection({
  onReady,
}: {
  onReady?: (email: string | null) => void;
}) {
  const [email, setEmail] = useState<string | null>(null),
    [address, setAddress] = useState(""),
    [password, setPassword] = useState(""),
    [register, setRegister] = useState(false),
    [busy, setBusy] = useState(false),
    [checking, setChecking] = useState(true),
    [message, setMessage] = useState(""),
    [unavailable, setUnavailable] = useState(false),
    [needsSetup, setNeedsSetup] = useState(false);
  useEffect(() => {
    let alive = true;
    ownerStatus()
      .then((v) => {
        if (alive) {
          setEmail(v);
          onReady?.(v);
        }
      })
      .catch((e) => {
        if (alive) {
          setUnavailable(true);
          setMessage(userError(e));
        }
      })
      .finally(() => {
        if (alive) setChecking(false);
      });
    return () => {
      alive = false;
    };
  }, []);
  async function submit() {
    setBusy(true);
    setMessage("");
    try {
      if (register && password.length < 8)
        throw Error("Use uma senha com pelo menos 8 caracteres.");
      const email = await login(address, password, register);
      setEmail(email);
      setNeedsSetup(false);
      setPassword("");
      onReady?.(email);
    } catch (e) {
      setMessage(userError(e));
      setNeedsSetup(
        ["auth/configuration-not-found", "auth/operation-not-allowed"].includes(
          (e as { code?: string })?.code ?? "",
        ),
      );
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
          Compartilhamento pelo Firebase. Somente os dados da seção escolhida
          são publicados.
        </p>
      </div>
      {email ? (
        <div className="firebase-connected">
          <span>
            <Check size={17} />
            {email}
          </span>
          <button
            type="button"
            className="text-button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await logout();
                setEmail(null);
                onReady?.(null);
              } catch (e) {
                setMessage(userError(e));
              } finally {
                setBusy(false);
              }
            }}
          >
            <LogOut size={15} />
            Sair
          </button>
        </div>
      ) : !unavailable ? (
        <form
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <p className="muted">
            {register
              ? "Crie seu acesso para publicar e gerenciar os links em qualquer aparelho."
              : "Entre para publicar, atualizar e revogar seus links."}
          </p>
          <label className="field">
            <span>E-mail</span>
            <input
              aria-label="E-mail de compartilhamento"
              type="email"
              required
              autoComplete="email"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Senha</span>
            <input
              aria-label="Senha de compartilhamento"
              type="password"
              required
              minLength={register ? 8 : 1}
              autoComplete={register ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit" className="button full" disabled={busy}>
            {busy ? "Conectando…" : register ? "Criar acesso" : "Entrar"}
          </button>
          <button
            type="button"
            className="text-button"
            onClick={() => {
              setRegister((v) => !v);
              setMessage("");
            }}
          >
            {register ? "Já tenho acesso" : "Criar meu acesso gratuito"}
          </button>
          {!register && (
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
                } catch (e) {
                  setMessage(userError(e));
                } finally {
                  setBusy(false);
                }
              }}
            >
              Esqueci minha senha
            </button>
          )}
        </form>
      ) : null}
      {(unavailable || needsSetup) && (
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
        O destinatário abre o link sem criar conta. Quem tiver o link poderá
        consultá-lo até você revogar ou ele expirar.
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
  const [email, setEmail] = useState<string | null>(null);
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
      <FirebaseConnection onReady={setEmail} />
      {email && (
        <button
          className="button full"
          type="button"
          disabled={busy}
          onClick={onPublish}
        >
          <Cloud size={18} />
          {busy
            ? "Publicando…"
            : grant
              ? "Atualizar publicação"
              : "Criar link por 30 dias"}
        </button>
      )}
      {grant?.provider === "firebase" && (
        <>
          <label className="field">
            <span>Link de acompanhamento</span>
            <input
              aria-label="Link de acompanhamento"
              readOnly
              value={grant.url}
              onFocus={(e) => e.target.select()}
            />
          </label>
          <small>
            Última sincronização:{" "}
            {new Date(grant.syncedAt).toLocaleString("pt-BR")}. Novos pagamentos
            são sincronizados quando houver conexão e sua conta estiver
            conectada.
          </small>
          {grant.error && (
            <p role="alert" className="firebase-message">
              {grant.error}
            </p>
          )}
          <button
            type="button"
            className="button secondary full"
            onClick={() => onSend(grant.url)}
          >
            <Link size={17} />
            Copiar ou enviar link
          </button>
          {email && (
            <button
              type="button"
              className="button danger full"
              disabled={busy}
              onClick={onRevoke}
            >
              <Lock size={17} />
              Revogar acesso
            </button>
          )}
        </>
      )}
    </div>
  );
}
