import {AnimatedFinanceChart} from "../../components/AnimatedFinanceChart";
import { platformLogos } from "./logos";
import { useState, useEffect, type FormEvent } from "react";
import { Bike, Plus, ArrowLeft, CalendarClock } from "lucide-react";
import {
  MotionCard,
  AnimatedMoney,
  MotionProgress,
} from "../../components/nexo-ui";

import { resizeIcon } from "../../lib/image-resize";
import {
  nextPayout,
  platformTotals,
  recordWithdrawal,
  type PayoutPlan,
} from "./model";
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const brands = (name: string) =>
  /ifood/i.test(name)
    ? ["iFood", "#c51925"]
    : /99/i.test(name)
      ? ["99", "#665300"]
      : /keeta/i.test(name)
        ? ["keeta", "#287126"]
        : /uber/i.test(name)
          ? ["Uber", "#171717"]
          : /indrive/i.test(name)
            ? ["inDrive", "#28582e"]
            : [name.slice(0, 2).toUpperCase(), "#355a82"];
const builtinIcon=(name:string)=>platformLogos[/ifood/i.test(name)?'ifood':/99/.test(name)?'99food':/keeta/i.test(name)?'keeta':/uber/i.test(name)?'uber':/indrive/i.test(name)?'indrive':'']||'';
export function DeliveryWorkspace({
  data,
  rows,
  visible,
  onChange,
  onCreate,
  onOpen,
  parseAmount,
}: {
  data: any;
  rows: any[];
  visible: boolean;
  onChange: (change: (draft: any) => void, message: string) => boolean;
  onCreate: (type: string) => void;
  onOpen: (delivery: any) => void;
  parseAmount: (value:string)=>number;
}) {
  const [selected, setSelected] = useState(""),
    [editor, setEditor] = useState(""),
    [withdraw, setWithdraw] = useState(false),
    [error, setError] = useState("");
  const [icon, setIcon] = useState("");
  const [limit,setLimit]=useState(50);
  useEffect(()=>{if(editor)document.getElementById('delivery-platform-editor')?.scrollIntoView({behavior:'smooth',block:'start'});},[editor]);
  const names: string[] = data.platforms;
  const list = selected ? rows.filter((d) => d.platform === selected) : rows;
  const gross = list.reduce((s, d) => s + d.amount, 0),
    cost = list.reduce((s, d) => s + d.cost, 0),
    known = list.filter((d) => d.km > 0),
    km = known.reduce((s, d) => s + d.km, 0),
    knownRevenue = known.reduce((s, d) => s + d.amount, 0),
    knownNet = known.reduce((s, d) => s + d.amount - d.cost, 0);
  const totals = selected
    ? platformTotals(data, selected)
    : names.reduce(
        (s, n) => {
          const t = platformTotals(data, n);
          return {
            earned: s.earned + t.earned,
            withdrawn: s.withdrawn + t.withdrawn,
            available: s.available + t.available,
          };
        },
        { earned: 0, withdrawn: 0, available: 0 },
      );
  const plans = data.deliveryPlatformSettings || {};
  const byDate = new Map<string,number>();
  for(const delivery of list)byDate.set(delivery.date,(byDate.get(delivery.date)||0)+delivery.amount);
  const daily=Array.from(byDate,([date,amount])=>({date,amount})).sort((a,b)=>a.date.localeCompare(b.date));
  const bestDay = [...daily].sort((a,b)=>b.amount-a.amount)[0];
  const money = (value: number, tone = "") => (
    <AnimatedMoney
      value={value}
      signed
      visible={visible}
      fromZero
      className={tone || (value < 0 ? "negative-text" : "positive-text")}
    />
  );
  const savePlan = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const plan: PayoutPlan = {
      mode: f.get("mode") as PayoutPlan["mode"],
      weekday: Number(f.get("weekday")),
      interval: Number(f.get("interval")),
      anchor: String(f.get("anchor")),
      icon: icon || plans[editor]?.icon || "",
    };
    if (plan.mode === "interval" && !nextPayout(plan)) {
      setError("Revise o intervalo e a primeira data.");
      return;
    }
    if (
      onChange((d) => {
        (d.deliveryPlatformSettings ??= {})[editor] = plan;
      }, "Programação de repasse salva.")
    )
      setEditor("");
  };
  return (
    <div className="delivery-workspace">
      <div className="workspace-actions">
        {selected && (
          <button
            type="button"
            onClick={() => {
              setSelected("");
              setWithdraw(false);
            }}
          >
            <ArrowLeft size={16} />
            Todas as plataformas
          </button>
        )}
        <h2>{selected || "Desempenho das entregas"}</h2>
        <button type="button" onClick={() => onCreate("delivery")}>
          <Plus size={16} />
          Entrega
        </button>
      </div>
      <div className="delivery-metrics">
        {[
          ["Ganho líquido", gross - cost],
          ["Receita bruta", gross],
          ["Custos", -cost],
        ].map(([title, value]) => (
          <MotionCard key={String(title)}>
            <small>{title}</small>
            <strong>{money(Number(value))}</strong>
          </MotionCard>
        ))}
        <MotionCard>
          <small>Receita por km informado</small>
          <strong>
            {km ? money(Math.round(knownRevenue / km)) : "Sem distância"}
          </strong>
          <small>
            {known.length} de {list.length} entregas com km
          </small>
        </MotionCard>
        <MotionCard>
          <small>Líquido por km informado</small>
          <strong>
            {km ? money(Math.round(knownNet / km)) : "Sem distância"}
          </strong>
          <small>{km.toLocaleString("pt-BR")} km informados</small>
        </MotionCard>
        <MotionCard>
          <small>Entregas no período</small>
          <strong>{list.length}</strong>
        </MotionCard>
      </div>
      <MotionCard className="card"><h2>Receita por dia trabalhado</h2><p>{bestDay ? `Dia de maior receita no período: ${bestDay.date.split('-').reverse().join('/')}.` : 'Registre entregas para comparar os dias.'}</p><AnimatedFinanceChart values={daily.map(d=>d.amount)} labels={daily.map(d=>d.date.split('-').slice(1).reverse().join('/'))} visible={visible}/></MotionCard>
      <MotionCard className="card">
        <h2>Saldo operacional · todo o histórico</h2>
        <p>
          Os ganhos continuam no total produzido após a retirada. Este controle
          de repasse não cria nova receita: cada entrega já registra a entrada
          na conta escolhida.
        </p>
        <div className="delivery-metrics">
          <div>
            <small>Total produzido</small>
            {money(totals.earned)}
          </div>
          <div>
            <small>Retirado / repassado</small>
            {money(-totals.withdrawn, "settled-money")}
          </div>
          <div>
            <small>A acompanhar</small>
            {money(totals.available)}
          </div>
        </div>
        {selected && (
          <button
            type="button"
            onClick={() => {
              setWithdraw(!withdraw);
              setError("");
            }}
          >
            Registrar retirada
          </button>
        )}
        {withdraw && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              try {
                const f = new FormData(event.currentTarget);
                const amount = parseAmount(String(f.get("amount")));
                if (
                  onChange(
                    (d) =>
                      recordWithdrawal(d, {
                        platform: selected,
                        amount,
                        date: String(f.get("date")),
                        note: String(f.get("note")),
                        accountId:String(f.get("accountId")||""),
                      }),
                    "Retirada registrada sem duplicar receita.",
                  )
                )
                  setWithdraw(false);
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            <label className="field">
              Valor da retirada (R$)
              <input name="amount" inputMode="decimal" required />
            </label>
            <label className="field">
              Data da retirada
              <input name="date" type="date" defaultValue={today()} required />
            </label>
            <label className="field">Conta que recebeu o repasse<select aria-label="Conta que recebeu o repasse" name="accountId">{data.accounts.map((bank:any)=><option key={bank.id} value={bank.id}>{bank.title}</option>)}</select></label>
            <label className="field">
              Descrição
              <input name="note" maxLength={160} />
            </label>
            <button type="submit">Confirmar retirada</button>
          </form>
        )}
      </MotionCard>
      <section aria-label="Plataformas de entrega">
        <div className="workspace-actions">
          <h2>Plataformas</h2>
          <button type="button" onClick={() => onCreate("platform")}>
            Adicionar plataforma
          </button>
        </div>
        <div className="delivery-platform-grid">
          {names.map((name) => {
            const [label, color] = brands(name),
              t = platformTotals(data, name),
              plan = plans[name],
              next = plan ? nextPayout(plan) : null;
            const revenue = rows
              .filter((d) => d.platform === name)
              .reduce((s, d) => s + d.amount, 0);
            return (
              <MotionCard className="delivery-platform-card" key={name}>
                <button
                  type="button"
                  className="platform-open"
                  onClick={() => {
                    setSelected(name);
                    setWithdraw(false);
                  }}
                >
                  <span
                    className="delivery-app-icon"
                    style={{ background: color }}
                  >
                    {plan?.icon || builtinIcon(name) ? (<img src={plan?.icon || builtinIcon(name)} alt=""/>) : (
                      <b>{label}</b>
                    )}
                  </span>
                  <span>
                    <strong>{name}</strong>
                    <small>Ver lançamentos e ganhos</small>
                  </span>
                </button>
                {money(revenue)}
                <MotionProgress
                  value={gross ? revenue / gross : 0}
                  label={`Participação de ${name} no período`}
                />
                <small className="settled-money">
                  Já retirado:{" "}
                  {visible
                    ? (t.withdrawn / 100).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : "••••"}
                </small>
                <small>
                  <CalendarClock size={14} />
                  {next
                    ? `Próximo repasse: ${next.split("-").reverse().join("/")}`
                    : "Repasse manual"}
                </small>
                <button
                  type="button"
                  onClick={() => {
                    setEditor(name);
                    setIcon("");
                    setError("");
                  }}
                >
                  Ícone e programação
                </button>
              </MotionCard>
            );
          })}
        </div>
      </section>
      {editor && (
        <MotionCard className="card" key={editor} id="delivery-platform-editor">
          <h2>Configurar {editor}</h2>
          <form onSubmit={savePlan}>
            <label className="field">
              Ícone do aplicativo
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (file)
                    try {
                      setIcon(await resizeIcon(file));
                    } catch (e) {
                      setError((e as Error).message);
                    }
                }}
              />
            </label>
            {icon && (
              <img
                className="delivery-app-icon"
                src={icon}
                alt="Prévia do ícone"
              />
            )}
            <label className="field">
              Frequência do repasse
              <select
                aria-label="Frequência do repasse" name="mode"
                defaultValue={plans[editor]?.mode || "manual"}
              >
                <option value="manual">Manual</option>
                <option value="weekly">Toda semana</option>
                <option value="interval">A cada número de dias</option>
              </select>
            </label>
            <label className="field">
              Dia semanal
              <select aria-label="Dia semanal" name="weekday" defaultValue={plans[editor]?.weekday ?? 3}>
                {[
                  "Domingo",
                  "Segunda",
                  "Terça",
                  "Quarta",
                  "Quinta",
                  "Sexta",
                  "Sábado",
                ].map((day, i) => (
                  <option key={day} value={i}>
                    {day}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Intervalo em dias
              <input
                name="interval"
                type="number"
                min="1"
                max="365"
                defaultValue={plans[editor]?.interval || 7}
                required
              />
            </label>
            <label className="field">
              Primeira data do ciclo
              <input
                name="anchor"
                type="date"
                defaultValue={plans[editor]?.anchor || today()}
                required
              />
            </label>
            <p>
              A programação indica a próxima data prevista. Nenhum repasse é
              marcado como recebido automaticamente.
            </p>
            <div className="workspace-actions">
              <button type="submit">Salvar programação</button>
              <button type="button" onClick={() => setEditor("")}>
                Cancelar
              </button>
            </div>
          </form>
        </MotionCard>
      )}
      {error && <p role="alert">{error}</p>}
      <MotionCard className="card">
        <h2>Histórico {selected ? `· ${selected}` : "de entregas"}</h2>
        {list.length ? (
          [...list]
            .sort((a, b) => b.date.localeCompare(a.date)).slice(0,limit)
            .map((d) => (
              <button
                type="button"
                className="delivery-history-row"
                key={d.id}
                onClick={() => onOpen(d)}
              >
                <Bike size={20} />
                <span>
                  <strong>{d.title}</strong>
                  <small>
                    {d.platform} · {d.date.split("-").reverse().join("/")} ·{" "}
                    {d.km ? `${d.km} km` : "Sem distância"}
                  </small>
                </span>
                {money(d.amount)}
              </button>
            ))
        ) : (
          <p>Nenhuma entrega neste período.</p>
        )}
      </MotionCard>
      {list.length>limit&&<button type="button" onClick={()=>setLimit(limit+50)}>Mostrar mais entregas</button>}
      {selected && (
        <MotionCard className="card">
          <h2>Retiradas registradas</h2>
          {(data.deliveryWithdrawals || [])
            .filter((r: any) => r.platform === selected)
            .map((r: any) => (
              <div className="delivery-history-row" key={r.id}>
                <span>
                  {r.date.split("-").reverse().join("/")}
                  <small>{r.note}</small>
                </span>
                {money(-r.amount, "settled-money")}
                <button
                  type="button"
                  onClick={() =>
                    onChange((d) => {
                      d.entries=d.entries.filter((entry:any)=>entry.deliveryPayoutId!==r.id);
                      d.deliveryWithdrawals = d.deliveryWithdrawals.filter(
                        (item: any) => item.id !== r.id,
                      );
                    }, "Retirada desfeita no controle operacional.")
                  }
                >
                  Desfazer
                </button>
              </div>
            ))}
        </MotionCard>
      )}
    </div>
  );
}
