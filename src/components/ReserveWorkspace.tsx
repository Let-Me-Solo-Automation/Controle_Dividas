import { DateInput } from "./DateInput";
import { useState, type FormEvent } from "react";
import { MotionProgress } from "./nexo-ui";
import { LiquidDangerButton } from "./LiquidDangerButton";
import {
  Landmark,
  Wallet,
  ShieldCheck,
  Leaf,
  Star,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
} from "lucide-react";
import {
  addBank,
  bankIcons,
  changeReserve,
  readBankIcon,
  reserveForAccount,
  reserveHistory,
  reserveToday,
  setReservePlan,
  type Bank,
  type ReserveData,
} from "../lib/reserve-model";

const icons = {
  bank: Landmark,
  wallet: Wallet,
  shield: ShieldCheck,
  leaf: Leaf,
  star: Star,
};
const iconLabels = {
  bank: "Banco",
  wallet: "Carteira",
  shield: "Proteção",
  leaf: "Folha",
  star: "Estrela",
  bradesco: "Bradesco",
  itau: "Itaú",
  c6: "C6 Bank",
  nubank: "Nubank",
  inter: "Inter",
  santander: "Santander",
  bb: "Banco do Brasil",
  caixa: "Caixa",
};
const bankWordmarks: Record<string, string> = {
  bradesco: "B",
  itau: "itaú",
  c6: "C6",
  nubank: "nu",
  inter: "inter",
  santander: "S",
  bb: "BB",
  caixa: "X",
};
export function BankMark({ bank }: { bank: Bank }) {
  const Icon = icons[bank.icon as keyof typeof icons] || Landmark;
  return (
    <span
      className="reserve-bank-mark"
      style={{ background: bank.color || "var(--accent)" }}
    >
      {bank.iconImage ? (
        <img
          src={bank.iconImage}
          alt=""
          style={{
            objectPosition: `${bank.iconPositionX ?? 50}% ${bank.iconPositionY ?? 50}%`,
          }}
        />
      ) : bankWordmarks[bank.icon || ""] ? (
        <strong className={`bank-wordmark bank-wordmark-${bank.icon}`}>
          {bankWordmarks[bank.icon || ""]}
        </strong>
      ) : (
        <Icon size={24} aria-hidden="true" />
      )}
    </span>
  );
}
export function BankFields() {
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);
  return (
    <div className="reserve-bank-fields">
      <label>
        Nome do banco ou carteira
        <input name="title" required maxLength={80} placeholder="Ex.: Nubank" />
      </label>
      <label>
        Descrição <span>(opcional)</span>
        <input
          name="description"
          maxLength={240}
          placeholder="Ex.: Minha conta para emergências"
        />
      </label>
      <label>
        Saldo inicial real (R$)
        <input name="amount" required inputMode="decimal" defaultValue="0,00" />
      </label>
      <p className="reserve-help">
        Informe apenas o dinheiro que já existe nesta conta. Metas e planos não
        aumentam seu patrimônio.
      </p>
      <div className="reserve-field-pair">
        <label>
          Ícone
          <select aria-label="Ícone" name="icon" defaultValue="bank">
            {bankIcons.map((icon) => (
              <option key={icon} value={icon}>
                {iconLabels[icon]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Cor
          <input name="color" type="color" defaultValue="#4968db" />
        </label>
      </div>
      <label>
        Imagem do banco{" "}
        <span>(opcional · até 20 MB, com ajuste automático)</span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={async (event) => {
            const input = event.currentTarget;
            const file = input.files?.[0];
            setError("");
            if (!file) return;
            setLoading(true);
            input.setCustomValidity("Aguarde a leitura da imagem.");
            try {
              setImage(await readBankIcon(file));
            } catch (error) {
              input.value = "";
              setImage("");
              setError((error as Error).message);
            } finally {
              setLoading(false);
              input.setCustomValidity("");
            }
          }}
        />
      </label>
      <input name="iconImage" type="hidden" value={image} />
      <input name="iconPositionX" type="hidden" value={positionX} />
      <input name="iconPositionY" type="hidden" value={positionY} />
      {loading && <p role="status">Lendo imagem…</p>}
      {image && (
        <div className="reserve-icon-crop">
          <div className="reserve-icon-preview">
            <img
              src={image}
              alt="Prévia do ícone do banco"
              style={{ objectPosition: `${positionX}% ${positionY}%` }}
            />
          </div>
          <label>
            Enquadramento horizontal
            <input
              aria-label="Enquadramento horizontal do ícone"
              type="range"
              min="0"
              max="100"
              value={positionX}
              onChange={(event) => setPositionX(Number(event.target.value))}
            />
          </label>
          <label>
            Enquadramento vertical
            <input
              aria-label="Enquadramento vertical do ícone"
              type="range"
              min="0"
              max="100"
              value={positionY}
              onChange={(event) => setPositionY(Number(event.target.value))}
            />
          </label>
          <button
            type="button"
            onClick={() => {
              setImage("");
              setPositionX(50);
              setPositionY(50);
            }}
          >
            Remover imagem
          </button>
        </div>
      )}
      {error && (
        <p role="alert" className="reserve-error">
          {error}
        </p>
      )}
    </div>
  );
}
export function bankFromForm(
  fields: FormData,
  parse: (value: string) => number,
) {
  return {
    title: String(fields.get("title") || ""),
    description: String(fields.get("description") || ""),
    initial: parse(String(fields.get("amount") || "0")),
    color: String(fields.get("color") || "#4968db"),
    icon: String(fields.get("icon") || "bank"),
    iconImage: String(fields.get("iconImage") || ""),
    iconPositionX: Number(fields.get("iconPositionX") || 50),
    iconPositionY: Number(fields.get("iconPositionY") || 50),
  };
}
export function ReserveTransactionFields({
  data,
  accountId,
}: {
  data: ReserveData;
  accountId?: string;
}) {
  return (
    <>
      <label>
        Banco
        <select
          aria-label="Banco"
          name="accountId"
          required
          defaultValue={accountId || data.accounts[0]?.id || ""}
        >
          <option value="" disabled>
            Escolha um banco
          </option>
          {data.accounts.map((bank) => (
            <option key={bank.id} value={bank.id}>
              {bank.title}
            </option>
          ))}
        </select>
      </label>
      <div className="reserve-field-pair">
        <label>
          Movimentação
          <select
            aria-label="Movimentação"
            name="direction"
            defaultValue="deposit"
          >
            <option value="deposit">Aportar na reserva</option>
            <option value="withdrawal">Resgatar da reserva</option>
          </select>
        </label>
        <label>
          Valor (R$)
          <input
            name="amount"
            inputMode="decimal"
            required
            placeholder="0,00"
          />
        </label>
      </div>
      <label>
        Data
        <DateInput name="date" required defaultValue={reserveToday()} />
      </label>
      <label>
        Nota curta <span>(opcional)</span>
        <input
          name="note"
          maxLength={160}
          placeholder="Ex.: Parte do salário deste mês"
        />
      </label>
      <p className="reserve-help">
        O aporte separa dinheiro disponível deste banco. O resgate libera esse
        valor na mesma conta. Nenhum dos dois altera seu patrimônio.
      </p>
    </>
  );
}
type Props = {
  data: ReserveData;
  format: (value: number) => string;
  parse: (value: string) => number;
  balance: (id: string) => number;
  free: (id: string) => number;
  onDataChange: (
    mutator: (data: ReserveData) => void,
    message: string,
  ) => boolean;
  onCreateBank: () => void;
  onDeleteBank: (id: string) => void;
};
export function ReserveWorkspace({
  data,
  format,
  parse,
  balance,
  free,
  onDataChange,
  onCreateBank,
  onDeleteBank,
}: Props) {
  const [accountId, setAccountId] = useState(data.accounts[0]?.id || "new");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [composer, setComposer] = useState(false);
  const selected =
    accountId === "new" || data.accounts.some((bank) => bank.id === accountId)
      ? accountId
      : data.accounts[0]?.id || "new";
  const totalBalance = data.accounts.reduce(
    (sum, bank) => sum + balance(bank.id),
    0,
  );
  const totalReserved = data.reserve.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const totalFree = data.accounts.reduce((sum, bank) => sum + free(bank.id), 0);
  const history = reserveHistory(data)
    .filter((entry) => filter === "all" || entry.accountId === filter)
    .slice()
    .reverse();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const fields = new FormData(event.currentTarget);
    try {
      const success = onDataChange((draft) => {
        const id =
          selected === "new"
            ? addBank(draft, bankFromForm(fields, parse))
            : selected;
        changeReserve(draft, {
          accountId: id,
          type: String(fields.get("direction")) as "deposit" | "withdrawal",
          amount: parse(String(fields.get("reserveAmount") || "0")),
          date: String(fields.get("date")),
          note: String(fields.get("note") || ""),
        });
      }, "Movimentação da reserva registrada.");
      if (success) setComposer(false);
    } catch (error) {
      setError((error as Error).message);
    }
  };
  return (
    <div className="reserve-workspace">
      <div className="reserve-intro">
        <div>
          <p className="reserve-eyebrow">CONTAS E RESERVA</p>
          <h2>Saldo e reserva por banco</h2>
          <p>
            Veja seu saldo real e acompanhe cada aporte, resgate e plano por
            banco.
          </p>
        </div>
        <button type="button" className="btn secondary" onClick={onCreateBank}>
          <Plus size={18} />
          Cadastrar banco
        </button>
      </div>
      <div className="reserve-summary">
        <section>
          <span>Patrimônio real nas contas</span>
          <strong className={totalBalance < 0 ? "money-out" : "money-in"}>
            {(totalBalance < 0 ? "−" : "+") + format(Math.abs(totalBalance))}
          </strong>
          <p>O dinheiro que você tem hoje.</p>
        </section>
        <section>
          <span>Separado na reserva</span>
          <strong className="money-in">+{format(totalReserved)}</strong>
          <p>Já faz parte do patrimônio.</p>
        </section>
        <section>
          <span>Disponível para alocar</span>
          <strong className={totalFree < 0 ? "money-out" : "money-in"}>
            {(totalFree < 0 ? "−" : "+") + format(Math.abs(totalFree))}
          </strong>
          <p>Após as reservas e metas.</p>
        </section>
      </div>
      <div className="reserve-section-heading">
        <div>
          <h2>Seus bancos</h2>
          <p>Saldo, reserva e planejamento em cada conta.</p>
        </div>
        <button
          type="button"
          className="btn primary"
          onClick={() => setComposer((value) => !value)}
          aria-expanded={composer}
        >
          <Plus size={18} />
          {composer ? "Fechar movimentação" : "Aporte ou resgate"}
        </button>
      </div>
      {composer && (
        <form className="reserve-composer form-stack" onSubmit={submit}>
          <h3>Movimentar reserva</h3>
          <label>
            Banco
            <select
              aria-label="Banco"
              value={selected}
              onChange={(event) => setAccountId(event.target.value)}
            >
              {data.accounts.map((bank) => (
                <option value={bank.id} key={bank.id}>
                  {bank.title}
                </option>
              ))}
              <option value="new">+ Cadastrar banco agora</option>
            </select>
          </label>
          {selected === "new" && (
            <fieldset>
              <legend>Novo banco</legend>
              <BankFields />
            </fieldset>
          )}
          {selected !== "new" && (
            <p className="reserve-help">
              Disponível: {format(free(selected))} · Reservado:{" "}
              {format(reserveForAccount(data, selected))}
            </p>
          )}
          <div className="reserve-field-pair">
            <label>
              Movimentação
              <select aria-label="Movimentação" name="direction">
                <option value="deposit">Aportar</option>
                <option value="withdrawal">Resgatar</option>
              </select>
            </label>
            <label>
              Valor (R$)
              <input
                name="reserveAmount"
                required
                inputMode="decimal"
                placeholder="0,00"
              />
            </label>
          </div>
          <label>
            Data
            <DateInput name="date" required defaultValue={reserveToday()} />
          </label>
          <label>
            Nota curta <span>(opcional)</span>
            <input
              name="note"
              maxLength={160}
              placeholder="Ex.: Reserva do mês"
            />
          </label>
          <p className="reserve-help">
            Aportes e resgates reorganizam o dinheiro na mesma conta. Seu
            patrimônio permanece igual.
          </p>
          {error && (
            <p className="reserve-error" role="alert">
              {error}
            </p>
          )}
          <button className="btn primary" type="submit">
            Registrar movimentação
          </button>
        </form>
      )}
      <div className="reserve-bank-grid">
        {data.accounts.map((bank) => {
          const reserved = reserveForAccount(data, bank.id);
          const plan = data.reservePlans?.find(
            (item) => item.accountId === bank.id,
          );
          const remaining = Math.max(0, (plan?.target || 0) - reserved);
          const months = plan?.monthly
            ? Math.ceil(remaining / plan.monthly)
            : null;
          return (
            <article className="reserve-bank-card" key={bank.id}>
              <div className="reserve-bank-heading">
                <BankMark bank={bank} />
                <LiquidDangerButton
                  className="reserve-delete"
                  aria-label={`Excluir banco ${bank.title}`}
                  onClick={() => onDeleteBank(bank.id)}
                >
                  <Trash2 size={17} />
                </LiquidDangerButton>
              </div>
              <h3>{bank.title}</h3>
              <p className="reserve-bank-description">
                {bank.description || "Sua conta, organizada por você."}
              </p>
              <span className="reserve-eyebrow">SALDO REAL</span>
              <strong className="reserve-bank-balance">
                {(balance(bank.id) < 0 ? "−" : "+") +
                  format(Math.abs(balance(bank.id)))}
              </strong>
              <dl>
                <div>
                  <dt>Disponível</dt>
                  <dd className={free(bank.id) < 0 ? "money-out" : "money-in"}>
                    {(free(bank.id) < 0 ? "−" : "+") +
                      format(Math.abs(free(bank.id)))}
                  </dd>
                </div>
                <div>
                  <dt>Na reserva</dt>
                  <dd className="money-in">+{format(reserved)}</dd>
                </div>
                <div>
                  <dt>Nas metas</dt>
                  <dd className="money-in">
                    +
                    {format(
                      Math.max(0, balance(bank.id) - free(bank.id) - reserved),
                    )}
                  </dd>
                </div>
              </dl>
              <div className="reserve-plan">
                <span>Objetivo da reserva</span>
                <strong>
                  {plan?.target ? format(plan.target) : "Defina seu objetivo"}
                </strong>
                {!!plan?.target && (
                  <>
                    <MotionProgress
                      value={Math.min(1, reserved / plan.target)}
                      label={`Progresso da reserva em ${bank.title}`}
                    />
                    <p>
                      {remaining
                        ? `Faltam ${format(remaining)}${months ? ` · cerca de ${months} ${months === 1 ? "mês" : "meses"} no ritmo planejado` : ""}`
                        : "Objetivo alcançado"}
                    </p>
                  </>
                )}
                <span>Plano mensal: {format(plan?.monthly || 0)}</span>
                <details>
                  <summary>Editar planejamento</summary>
                  <PlanForm
                    data={data}
                    accountId={bank.id}
                    parse={parse}
                    onDataChange={onDataChange}
                  />
                </details>
                <small>
                  Objetivo e plano são intenções. Não entram no patrimônio nem
                  geram aportes automáticos.
                </small>
              </div>
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  setAccountId(bank.id);
                  setComposer(true);
                }}
              >
                Aportar ou resgatar
              </button>
            </article>
          );
        })}
      </div>
      {!data.accounts.length && (
        <div className="reserve-empty">
          <Landmark size={32} />
          <h3>Comece com seu primeiro banco</h3>
          <p>
            Cadastre o saldo que já existe na conta e separe uma parte para sua
            reserva.
          </p>
          <button type="button" className="btn primary" onClick={onCreateBank}>
            Cadastrar banco
          </button>
        </div>
      )}
      <section className="reserve-ledger">
        <div className="reserve-section-heading">
          <div>
            <h2>Histórico da reserva</h2>
            <p>Cada movimentação conserva sua data e nota.</p>
          </div>
          <label>
            Filtrar banco
            <select
              aria-label="Filtrar banco"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">Todos os bancos</option>
              {data.accounts.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        {history.length ? (
          <ul>
            {history.map((entry) => (
              <li key={entry.id} data-kind={entry.type}>
                <span className="reserve-ledger-icon">
                  {entry.type === "withdrawal" ? (
                    <ArrowUpRight size={20} />
                  ) : (
                    <ArrowDownLeft size={20} />
                  )}
                </span>
                <div>
                  <strong>
                    {entry.type === "opening"
                      ? "Saldo anterior"
                      : entry.type === "deposit"
                        ? "Aporte"
                        : "Resgate"}{" "}
                    ·{" "}
                    {
                      data.accounts.find((bank) => bank.id === entry.accountId)
                        ?.title
                    }
                  </strong>
                  <p>{entry.note || "Sem nota"}</p>
                  <time dateTime={entry.date}>
                    {entry.date.split("-").reverse().join("/")}
                  </time>
                </div>
                <strong className="reserve-ledger-amount">
                  {entry.type === "withdrawal" ? "−" : "+"}
                  {format(entry.amount)}
                </strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="reserve-empty-copy">
            Seu primeiro aporte aparecerá aqui. Você pode registrar vários
            aportes e resgates em cada banco.
          </p>
        )}
      </section>
    </div>
  );
}
function PlanForm({
  data,
  accountId,
  parse,
  onDataChange,
}: Pick<Props, "data" | "parse" | "onDataChange"> & { accountId: string }) {
  const [error, setError] = useState("");
  const plan = data.reservePlans?.find((item) => item.accountId === accountId);
  return (
    <form
      className="reserve-plan-form"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");
        const fields = new FormData(event.currentTarget);
        try {
          onDataChange(
            (draft) =>
              setReservePlan(draft, {
                accountId,
                target: parse(String(fields.get("target") || "0")),
                monthly: parse(String(fields.get("monthly") || "0")),
              }),
            "Planejamento da reserva salvo.",
          );
        } catch (error) {
          setError((error as Error).message);
        }
      }}
    >
      <label>
        Objetivo (R$)
        <input
          name="target"
          required
          inputMode="decimal"
          defaultValue={((plan?.target || 0) / 100)
            .toFixed(2)
            .replace(".", ",")}
        />
      </label>
      <label>
        Aporte mensal planejado (R$)
        <input
          name="monthly"
          required
          inputMode="decimal"
          defaultValue={((plan?.monthly || 0) / 100)
            .toFixed(2)
            .replace(".", ",")}
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit" className="btn secondary">
        Salvar plano
      </button>
    </form>
  );
}
