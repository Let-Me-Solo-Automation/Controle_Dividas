import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Plus,
  ArrowLeft,
  Settings2,
  ChevronRight,
  Check,
  Bike,
} from "lucide-react";
import { MotionProgress, AnimatedMoney } from "../../components/nexo-ui";
import { AnimatedFinanceChart } from "../../components/AnimatedFinanceChart";
import { AnimatedDisclosure } from "../../components/AnimatedDisclosure";
import { SaveToggleButton } from "../../components/SaveToggleButton";
import { DateInput } from "../../components/DateInput";
import { resizeIcon } from "../../lib/image-resize";
import { platformIcon } from "./PlatformPicker";
import {
  nextPayout,
  platformTotals,
  recordWithdrawal,
  type PayoutPlan,
} from "./model";
const today = () => new Date().toLocaleDateString("sv-SE");
const formatDate = (date: string) =>
  new Date(date + "T12:00:00").toLocaleDateString("pt-BR");
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
  parseAmount: (value: string) => number;
}) {
  const [selected, setSelected] = useState(""),
    [confirm, setConfirm] = useState(false),
    [error, setError] = useState(""),
    [limit, setLimit] = useState(30),
    [icon, setIcon] = useState(""),
    [iconBusy, setIconBusy] = useState(false),
    [revision, setRevision] = useState(0),
    [mode, setMode] = useState("manual");
  const form = useRef<HTMLFormElement>(null),
    root = useRef<HTMLDivElement>(null),
    reduce = useReducedMotion();
  const plans = data.deliveryPlatformSettings || {},
    plan: PayoutPlan = plans[selected] || {
      mode: "manual",
      weekday: 3,
      interval: 7,
      anchor: today(),
    },
    list = selected ? rows.filter((row) => row.platform === selected) : rows;
  const earned = list.reduce((sum, row) => sum + row.amount, 0),
    known = list.filter((row) => row.km > 0),
    km = known.reduce((sum, row) => sum + row.km, 0),
    knownRevenue = known.reduce((sum, row) => sum + row.amount, 0),
    sources = [...new Set(known.map((row) => row.platform))];
  const totals = selected
    ? platformTotals(data, selected)
    : data.platforms.reduce(
        (sum: any, name: string) => {
          const t = platformTotals(data, name);
          return {
            earned: sum.earned + t.earned,
            withdrawn: sum.withdrawn + t.withdrawn,
            available: sum.available + t.available,
            pendingAvailable: sum.pendingAvailable + t.pendingAvailable,
          };
        },
        { earned: 0, withdrawn: 0, available: 0, pendingAvailable: 0 },
      );
  const daily = Array.from(
    list.reduce(
      (map: Map<string, number>, row: any) =>
        map.set(row.date, (map.get(row.date) || 0) + row.amount),
      new Map<string, number>(),
    ) as Map<string, number>,
  ).sort((a, b) => a[0].localeCompare(b[0]));
  const month = today().slice(0, 7),
    monthly = (data.deliveries || [])
      .filter(
        (row: any) => row.platform === selected && row.date.startsWith(month),
      )
      .reduce((sum: number, row: any) => sum + row.amount, 0),
    goal = plan.monthlyGoal || 0;
  const endMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
    ).getDate(),
    remainingDays = endMonth - new Date().getDate() + 1,
    weekly = Math.ceil((Math.max(0, goal - monthly) / remainingDays) * 7);
  const money = (value: number, tone = "") => (
    <AnimatedMoney
      value={value}
      visible={visible}
      fromZero
      signed
      className={tone || (value < 0 ? "negative-text" : "positive-text")}
    />
  );
  const openPlatform = (name: string) => {
    setSelected(name);
    setError("");
    setIcon("");
    setConfirm(false);
    setMode(plans[name]?.mode || "manual");
    setRevision(0);
    requestAnimationFrame(() =>
      root.current?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      }),
    );
  };
  useEffect(() => {
    if (!selected) return;
    const back = (event: Event) => {
      event.preventDefault();
      setSelected("");
      setConfirm(false);
      setIcon("");
      setError("");
      requestAnimationFrame(() =>
        root.current?.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        }),
      );
    };
    window.addEventListener("marks:navigate-back", back);
    return () => window.removeEventListener("marks:navigate-back", back);
  }, [selected, reduce]);
  const savePlan = () => {
    if (!form.current?.reportValidity()) return false;
    try {
      const f = new FormData(form.current!),
        monthlyGoal = String(f.get("monthlyGoal") || "").trim()
          ? parseAmount(String(f.get("monthlyGoal")))
          : 0;
      if (monthlyGoal < 0) throw Error("A meta deve ser positiva.");
      const next: PayoutPlan = {
        mode: mode as PayoutPlan["mode"],
        weekday: Number(f.get("weekday") || 3),
        interval: Number(f.get("interval") || 7),
        anchor: String(f.get("anchor") || today()),
        icon: icon || plan.icon || "",
        accountId: String(f.get("accountId") || ""),
        receiptStatus:
          f.get("receiptStatus") === "received" ? "received" : "pending",
        monthlyGoal,
        lastConfirmed: plan.lastConfirmed,
      };
      if (!data.accounts.some((bank: any) => bank.id === next.accountId))
        throw Error("Cadastre e selecione a conta de repasse.");
      if (mode === "interval" && !nextPayout(next))
        throw Error("Confira a primeira data e o intervalo.");
      const ok = onChange((d) => {
        (d.deliveryPlatformSettings ??= {})[selected] = next;
      }, "Configurações da plataforma salvas.");
      if (ok) setError("");
      return ok;
    } catch (error) {
      setError((error as Error).message);
      return false;
    }
  };
  return (
    <div className="delivery-workspace delivery-refined" ref={root}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={selected || "platforms"}
          className="delivery-view"
          initial={{ opacity: 0, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : -4 }}
          transition={{ duration: reduce ? 0 : 0.22 }}
        >
          <header className="workspace-actions">
            {selected ? (
              <>
                <button type="button" onClick={() => openPlatform("")}>
                  <ArrowLeft size={16} />
                  Plataformas
                </button>
                <h2>{selected}</h2>
              </>
            ) : (
              <>
                <div>
                  <h2>Suas entregas</h2>
                  <p className="muted">Ganhos, plataformas e repasses.</p>
                </div>
                <button
                  type="button"
                  className="delivery-primary"
                  onClick={() => onCreate("delivery")}
                >
                  <Plus size={17} />
                  Entrega
                </button>
              </>
            )}
          </header>
          {!selected ? (
            <>
              <section
                className="delivery-kpi-strip"
                aria-label="Indicadores das entregas"
              >
                <div>
                  <small>Produzido no período</small>
                  <strong>{money(earned)}</strong>
                </div>
                <div>
                  <small>Entregas</small>
                  <strong>{list.length}</strong>
                </div>
                <div>
                  <small>Receita por km informado</small>
                  <strong>
                    {km
                      ? money(Math.round(knownRevenue / km))
                      : "Sem distância"}
                  </strong>
                  <small>
                    Plataformas:{" "}
                    {sources.join(", ") || "nenhuma com km informado"}.{" "}
                    {known.length} entregas, {km.toLocaleString("pt-BR")} km.
                  </small>
                </div>
              </section>
              <section className="delivery-platform-section">
                <div className="workspace-actions">
                  <h3>Plataformas</h3>
                  <button type="button" onClick={() => onCreate("platform")}>
                    <Plus size={15} />
                    Adicionar
                  </button>
                </div>
                <div className="delivery-platform-list">
                  {data.platforms.map((name: string) => {
                    const t = platformTotals(data, name),
                      image = platformIcon(name, plans),
                      revenue = rows
                        .filter((row) => row.platform === name)
                        .reduce((sum, row) => sum + row.amount, 0);
                    return (
                      <button
                        type="button"
                        className="platform-open delivery-platform-row"
                        key={name}
                        onClick={() => openPlatform(name)}
                      >
                        <span className="delivery-app-icon">
                          {image ? (
                            <img src={image} alt="" />
                          ) : (
                            <Bike size={24} />
                          )}
                        </span>
                        <span className="platform-row-copy">
                          <strong>{name}</strong>
                          <small>
                            {plans[name]?.accountId
                              ? "Conta e repasse configurados"
                              : "Configurar conta e repasse"}
                          </small>
                        </span>
                        <span className="platform-row-values">
                          {money(revenue)}
                          <small className="settled-money">
                            Repassado:{" "}
                            {visible
                              ? (t.withdrawn / 100).toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })
                              : "••••"}
                          </small>
                        </span>
                        <ChevronRight size={17} />
                      </button>
                    );
                  })}
                </div>
              </section>
              <section className="delivery-section">
                <h3>Receita por data</h3>
                <AnimatedFinanceChart
                  values={daily.map((row) => row[1])}
                  labels={daily.map((row) => formatDate(row[0]))}
                  visible={visible}
                />
              </section>
            </>
          ) : (
            <>
              <section className="delivery-kpi-strip">
                <div>
                  <small>Total produzido</small>
                  <strong>{money(totals.earned)}</strong>
                </div>
                <div>
                  <small>Repassado</small>
                  <strong>{money(-totals.withdrawn, "settled-money")}</strong>
                </div>
                <div>
                  <small>Disponível na plataforma</small>
                  <strong>{money(totals.available)}</strong>
                </div>
              </section>
              <section className="delivery-section">
                <h3>
                  <Settings2 size={17} />
                  Configurações de {selected}
                </h3>
                <form
                  ref={form}
                  onSubmit={(event) => event.preventDefault()}
                  onChange={() => setRevision((value) => value + 1)}
                  className="platform-settings-form"
                >
                  <label className="field">
                    Conta de repasse
                    <select
                      name="accountId"
                      required
                      defaultValue={plan.accountId || ""}
                    >
                      <option value="">Escolha a conta</option>
                      {data.accounts.map((bank: any) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.title}
                        </option>
                      ))}
                    </select>
                    <small>
                      Todos os lançamentos desta plataforma usarão esta conta.
                    </small>
                  </label>
                  <label className="field">
                    Quando o dinheiro entra na conta
                    <select
                      name="receiptStatus"
                      defaultValue={plan.receiptStatus || "pending"}
                    >
                      <option value="pending">Após confirmar o repasse</option>
                      <option value="received">
                        Ao registrar cada entrega
                      </option>
                    </select>
                  </label>
                  <label className="field">
                    Frequência do repasse
                    <select
                      name="mode"
                      value={mode}
                      onChange={(event) => setMode(event.target.value)}
                    >
                      <option value="manual">Manual</option>
                      <option value="weekly">Toda semana</option>
                      <option value="interval">A cada número de dias</option>
                    </select>
                  </label>
                  <AnimatePresence>
                    {mode === "weekly" && (
                      <motion.label
                        className="field"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Dia do repasse
                        <select name="weekday" defaultValue={plan.weekday ?? 3}>
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
                      </motion.label>
                    )}
                    {mode === "interval" && (
                      <motion.div
                        className="compact-field-pair"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <label className="field">
                          Intervalo em dias
                          <input
                            name="interval"
                            type="number"
                            min="1"
                            max="365"
                            required
                            defaultValue={plan.interval || 7}
                          />
                        </label>
                        <label className="field">
                          Primeira data
                          <DateInput
                            name="anchor"
                            required
                            defaultValue={plan.anchor || today()}
                          />
                        </label>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <label className="field compact-amount">
                    Meta mensal (R$)
                    <input
                      name="monthlyGoal"
                      inputMode="decimal"
                      placeholder="0,00"
                      defaultValue={
                        goal ? (goal / 100).toFixed(2).replace(".", ",") : ""
                      }
                    />
                  </label>
                  <AnimatedDisclosure title="Alterar ícone da plataforma">
                    <label className="field">
                      Imagem PNG, JPEG ou WebP
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          setIconBusy(true);
                          try {
                            setIcon(await resizeIcon(file));
                            setRevision((value) => value + 1);
                          } catch (error) {
                            setError((error as Error).message);
                          } finally {
                            setIconBusy(false);
                          }
                        }}
                      />
                    </label>
                    {(icon || plan.icon) && (
                      <img
                        className="delivery-app-icon"
                        src={icon || plan.icon}
                        alt="Prévia do ícone"
                      />
                    )}
                    <small>A imagem inteira é ajustada ao padrão.</small>
                  </AnimatedDisclosure>
                  <SaveToggleButton
                    label="Salvar plataforma"
                    revision={String(revision)}
                    disabled={iconBusy}
                    onSave={savePlan}
                  />
                </form>
              </section>
              {goal > 0 && (
                <section className="delivery-section">
                  <h3>
                    Meta de{" "}
                    {new Date().toLocaleDateString("pt-BR", { month: "long" })}
                  </h3>
                  <div className="amount-pair">
                    <strong>{money(monthly)}</strong>
                    <span>
                      de{" "}
                      {visible
                        ? (goal / 100).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })
                        : "••••"}
                    </span>
                  </div>
                  <MotionProgress
                    value={visible ? monthly / goal : 0}
                    label={`Meta mensal de ${selected}`}
                  />
                  <p>
                    {monthly >= goal ? (
                      "Meta mensal concluída."
                    ) : (
                      <>
                        Para atingir a meta: {money(weekly)} por semana,
                        considerando os {remainingDays} dias restantes.
                      </>
                    )}
                  </p>
                </section>
              )}
              <section className="delivery-section">
                <h3>Repasse</h3>
                <p>
                  {nextPayout(plan)
                    ? `Próximo previsto: ${formatDate(nextPayout(plan)!)}`
                    : "Confirme quando receber."}
                </p>
                <button
                  type="button"
                  className="delivery-primary"
                  onClick={() => {
                    setConfirm(!confirm);
                    setError("");
                  }}
                >
                  <Check size={16} />
                  Confirmar recebimento do repasse
                </button>
                <AnimatePresence>
                  {confirm && (
                    <motion.form
                      className="payout-confirm-form"
                      initial={{ opacity: 0, y: reduce ? 0 : -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      onSubmit={(event) => {
                        event.preventDefault();
                        try {
                          const f = new FormData(event.currentTarget),
                            amount = parseAmount(String(f.get("amount"))),
                            date = String(f.get("date"));
                          if (
                            onChange((d) => {
                              recordWithdrawal(d, {
                                platform: selected,
                                amount,
                                date,
                                note: "Repasse confirmado",
                                accountId: plan.accountId,
                              });
                              (d.deliveryPlatformSettings ??= {})[selected] = {
                                ...plan,
                                lastConfirmed: date,
                              };
                            }, "Repasse confirmado. Conta atualizada sem duplicar receita.")
                          ) {
                            setConfirm(false);
                            setError("");
                          }
                        } catch (error) {
                          setError((error as Error).message);
                        }
                      }}
                    >
                      <p>
                        Confirme apenas após verificar o recebimento na conta
                        cadastrada.
                      </p>
                      <label className="field compact-amount">
                        Valor recebido (R$)
                        <input
                          name="amount"
                          inputMode="decimal"
                          required
                          defaultValue={(totals.available / 100)
                            .toFixed(2)
                            .replace(".", ",")}
                        />
                      </label>
                      <label className="field compact-date">
                        Data do recebimento
                        <DateInput
                          name="date"
                          required
                          defaultValue={today()}
                        />
                      </label>
                      <button type="submit">Recebi este valor</button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </section>
            </>
          )}
          {error && (
            <p role="alert" className="negative-text">
              {error}
            </p>
          )}
          <AnimatedDisclosure
            title={
              selected ? "Lançamentos desta plataforma" : "Últimas entregas"
            }
            defaultOpen={!selected}
          >
            <div className="delivery-history">
              {list.length ? (
                [...list]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .slice(0, limit)
                  .map((row) => (
                    <button
                      type="button"
                      className="delivery-history-row"
                      key={row.id}
                      onClick={() => onOpen(row)}
                    >
                      <span className="delivery-app-icon small">
                        {platformIcon(row.platform, plans) ? (
                          <img src={platformIcon(row.platform, plans)} alt="" />
                        ) : (
                          <Bike size={18} />
                        )}
                      </span>
                      <span>
                        <strong>{row.title}</strong>
                        <small>
                          {row.platform} · {formatDate(row.date)} ·{" "}
                          {row.km ? `${row.km} km` : "Sem distância"}
                        </small>
                      </span>
                      {money(row.amount)}
                    </button>
                  ))
              ) : (
                <p>Nenhuma entrega neste período.</p>
              )}
              {list.length > limit && (
                <button type="button" onClick={() => setLimit(limit + 30)}>
                  Mostrar mais
                </button>
              )}
            </div>
          </AnimatedDisclosure>
          {selected && (
            <AnimatedDisclosure title="Repasses confirmados">
              {(data.deliveryWithdrawals || [])
                .filter((row: any) => row.platform === selected)
                .map((row: any) => (
                  <div className="delivery-history-row" key={row.id}>
                    <span>
                      {formatDate(row.date)}
                      <small>{row.note}</small>
                    </span>
                    {money(-row.amount, "settled-money")}
                    <button
                      type="button"
                      onClick={() =>
                        onChange((d) => {
                          d.entries = d.entries.filter(
                            (entry: any) => entry.deliveryPayoutId !== row.id,
                          );
                          d.deliveryWithdrawals = d.deliveryWithdrawals.filter(
                            (item: any) => item.id !== row.id,
                          );
                          const remaining = d.deliveryWithdrawals
                            .filter((item: any) => item.platform === selected)
                            .map((item: any) => item.date)
                            .sort();
                          d.deliveryPlatformSettings[selected].lastConfirmed =
                            remaining.at(-1) || "";
                        }, "Confirmação desfeita. Saldo recalculado.")
                      }
                    >
                      Desfazer
                    </button>
                  </div>
                ))}
            </AnimatedDisclosure>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
