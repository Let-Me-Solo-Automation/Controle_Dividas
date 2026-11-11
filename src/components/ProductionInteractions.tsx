import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  CalendarDays,
  List,
  Landmark,
  Search,
  ShieldCheck,
  Target,
  Wallet,
  Plus,
  Folder,
  Pin,
  Link,
  Layers,
  LockKeyhole,
  CircleHelp,
} from "lucide-react";
import {
  FaTasks,
  FaArrowDown,
  FaArrowUp,
  FaExchangeAlt,
  FaThumbtack,
  FaLink,
} from "react-icons/fa";
import { AdaptiveSlider } from "./reference/AdaptiveSlider";
import {
  ActivitiesCard,
  type ActivityItemType,
} from "./reference/ActivitiesCard";
import { CalendarWidget, type EventsData } from "./reference/CalendarWidget";
import { FilterDisclosure } from "./reference/FilterDisclosure";
import { InviteDisclosure } from "./reference/InviteDisclosure";
import { OptionPicker } from "./reference/OptionPicker";
import { PinItemComponent, type PlaceItem } from "./reference/PinItemComponent";
import { SlotPicker } from "./reference/SlotPicker";
import { SwitchDisclosure } from "./reference/SwitchDisclosure";
import { TaskWidget, type TaskData } from "./reference/TaskWidget";
import { ViewOnMap } from "./reference/ViewOnMap";
import { AccordionApp } from "./reference/AccordionApp";
import {
  CarouselNavigator,
  ContextualAIBar,
  DiscreteTabs,
  FluidTabs,
} from "./nexo-ui";

function Surface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <LayoutGroup id={id}>
      <div className={`production-surface ${className}`}>{children}</div>
    </LayoutGroup>
  );
}

type Choice = { id: string; title: string };
export function EntryFilters({
  accounts,
  kind,
  account,
  onKind,
  onAccount,
}: {
  accounts: Choice[];
  kind: string;
  account: string;
  onKind: (id: string) => void;
  onAccount: (id: string) => void;
}) {
  const labels: Record<string, string> = {
    all: "Todos os movimentos",
    income: "Receitas",
    expense: "Despesas",
    transfer: "Transferências",
  };
  return (
    <Surface className="production-filters">
      <div className="production-filter-kind">
        <FilterDisclosure
          defaultActiveId={kind}
          onChange={onKind}
          items={[
            { id: "all", label: "Todos os movimentos", icon: FaTasks },
            { id: "income", label: "Receitas", icon: FaArrowDown },
            { id: "expense", label: "Despesas", icon: FaArrowUp },
            { id: "transfer", label: "Transferências", icon: FaExchangeAlt },
          ]}
        />
        <span aria-live="polite">{labels[kind]}</span>
      </div>
      <OptionPicker
        label="Filtrar por conta"
        value={account}
        onChange={onAccount}
        options={[
          { id: "all", label: "Todas as contas", icon: Landmark },
          ...accounts.map((a) => ({ id: a.id, label: a.title, icon: Wallet })),
        ]}
      />
    </Surface>
  );
}

export function RecentActivity({
  activities,
  onOpenAll,
}: {
  activities: ActivityItemType[];
  onOpenAll: () => void;
}) {
  return (
    <Surface className="production-activities">
      <ActivitiesCard
        headerIcon={<ArrowLeftRight size={24} />}
        title="Últimos movimentos"
        subtitle={
          activities.length
            ? `${activities.length} registros recentes · toque para ver`
            : "Seu histórico começa com um lançamento"
        }
        activities={activities}
      />
      <button
        type="button"
        className="text-button production-all"
        onClick={onOpenAll}
      >
        Ver extrato completo <ArrowUpRight size={15} />
      </button>
    </Surface>
  );
}

export function GoalProgress({ data }: { data: TaskData }) {
  return (
    <Surface className="production-goals">
      <p className="eyebrow">SEU PLANO EM MOVIMENTO</p>
      <TaskWidget data={data} />
      <p className="production-hint">
        Expanda para organizar um aporte ou acompanhar uma meta. O progresso
        acompanha o dinheiro já reservado.
      </p>
    </Surface>
  );
}

export function SectionOrganizer({
  items,
  grants,
  onPin,
  onShare,
}: {
  items: PlaceItem[];
  grants: { id: string; title: string; description: string; error?: boolean }[];
  onPin: (id: string | number, value: boolean) => void;
  onShare: (id: string) => void;
}) {
  const [filter, setFilter] = useState("all");
  const visible = items.filter(
    (item) =>
      filter === "all" ||
      (filter === "pinned"
        ? item.pinned
        : grants.some((g) => g.id === item.id)),
  );
  return (
    <Surface className="production-sections">
      <div className="production-section-tools">
        <div className="production-filter-kind">
          <FluidTabs
            defaultActive="all"
            onChange={setFilter}
            tabs={[
              { id: "all", label: "Todas", icon: <Folder size={17} /> },
              { id: "pinned", label: "Fixadas", icon: <Pin size={17} /> },
              { id: "shared", label: "Links", icon: <Link size={17} /> },
            ]}
          />
          <span aria-live="polite">
            {filter === "pinned"
              ? "Seções fixadas"
              : filter === "shared"
                ? "Com link ativo"
                : "Todas as seções"}
          </span>
        </div>
        {grants.length > 0 && (
          <InviteDisclosure
            title="Links ativos"
            badgeCount={grants.length}
            invites={grants.map((g) => ({
              id: g.id,
              title: g.title,
              description: g.description,
              hasUpdate: g.error,
              icon: <Link size={19} />,
              action: () => onShare(g.id),
            }))}
          />
        )}
      </div>
      {visible.length ? (
        <PinItemComponent items={visible} onPinChange={onPin} />
      ) : (
        <p className="muted">Nenhuma seção corresponde a este filtro.</p>
      )}
    </Surface>
  );
}

type AgendaItem = {
  id: string;
  date: string;
  title: string;
  amount: number;
  type: string;
  open: () => void;
};
type DateWindow = {
  id: string;
  label: string;
  enabled: boolean;
  slots: { id: string; from: string; to: string }[];
};
export function FinanceAgenda({
  items,
  selected,
  onSelect,
  onMonth,
  format,
}: {
  items: AgendaItem[];
  selected: string;
  onSelect: (date: string) => void;
  onMonth: (offset: number) => void;
  format: (value: number) => string;
}) {
  const [scope, setScope] = useState("day");
  const [windows, setWindows] = useState<DateWindow[]>([
    {
      id: "period",
      label: "Filtrar por intervalo",
      enabled: false,
      slots: [
        { id: "range", from: selected.slice(0, 7) + "-01", to: selected },
      ],
    },
  ]);
  const active = windows.filter((w) => w.enabled).flatMap((w) => w.slots);
  const invalid = active.some((s) => !s.from || !s.to || s.from > s.to);
  const filtered = invalid
    ? []
    : items.filter(
        (item) =>
          !active.length ||
          active.some((w) => item.date >= w.from && item.date <= w.to),
      );
  const events: EventsData = {};
  for (const item of filtered)
    (events[item.date] ||= []).push({
      id: item.id,
      title: item.title,
      time: `${item.type === "goal" ? "Prazo da meta" : item.type === "receive" || item.type === "income" ? "A receber" : "A pagar"} · ${format(item.amount)}`,
      action: item.open,
    });
  const upcoming = filtered.filter((item) => item.date >= selected);
  return (
    <Surface className="production-agenda">
      <div className="production-agenda-heading">
        <button
          className="text-button"
          aria-label="Mês anterior"
          onClick={() => onMonth(-1)}
        >
          ←
        </button>
        <h2>Sua agenda</h2>
        <button
          className="text-button"
          aria-label="Próximo mês"
          onClick={() => onMonth(1)}
        >
          →
        </button>
      </div>
      <CalendarWidget
        key={selected.slice(0, 7)}
        events={events}
        selectedDate={selected}
        initialSelectedDate={selected}
        onSelect={onSelect}
        currentMonthYear={new Date(selected + "T12:00:00").toLocaleDateString(
          "pt-BR",
          { month: "long", year: "numeric" },
        )}
      />
      <div className="production-agenda-controls">
        <DiscreteTabs
          defaultTab="day"
          onTabChange={setScope}
          tabs={[
            {
              id: "day",
              label: "Dia selecionado",
              icon: <CalendarDays size={18} />,
            },
            { id: "next", label: "Próximos prazos", icon: <List size={18} /> },
          ]}
        />
        <SlotPicker
          days={windows}
          inputType="date"
          defaultFrom={selected}
          defaultTo={selected}
          onUpdate={setWindows}
        />
      </div>
      {invalid && (
        <p role="alert" className="production-hint">
          Informe um intervalo com data final igual ou posterior à inicial.
        </p>
      )}
      {scope === "next" && (
        <div className="production-upcoming">
          <h3>
            A partir de{" "}
            {new Date(selected + "T12:00:00").toLocaleDateString("pt-BR")}
          </h3>
          {upcoming.length ? (
            upcoming.map((item) => (
              <button
                type="button"
                key={`${item.type}-${item.id}`}
                onClick={item.open}
              >
                <CalendarDays size={18} />
                <span>
                  <strong>{item.title}</strong>
                  <small>
                    {new Date(item.date + "T12:00:00").toLocaleDateString(
                      "pt-BR",
                    )}
                  </small>
                </span>
                <b>{format(item.amount)}</b>
              </button>
            ))
          ) : (
            <p className="muted">Nenhum prazo encontrado neste intervalo.</p>
          )}
        </div>
      )}
    </Surface>
  );
}

type Highlight = {
  id: string;
  eyebrow: string;
  title: string;
  detail: string;
  actionLabel: string;
  action: () => void;
};
export function FinanceHighlights({ items }: { items: Highlight[] }) {
  const [index, setIndex] = useState(0);
  if (!items.length) return null;
  const current = items[index % items.length];
  return (
    <Surface className="production-highlights">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 9 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -9 }}
          className="production-highlight"
          aria-live="polite"
        >
          <span className="eyebrow">{current.eyebrow}</span>
          <h2>{current.title}</h2>
          <p>{current.detail}</p>
          <button
            type="button"
            className="text-button"
            onClick={current.action}
          >
            {current.actionLabel} <ArrowUpRight size={16} />
          </button>
        </motion.div>
      </AnimatePresence>
      <CarouselNavigator
        autoDelay={0}
        totalSlides={items.length}
        currentIndex={index}
        onIndexChange={setIndex}
      />
    </Surface>
  );
}

export function FinanceShortcuts({
  onNavigate,
  onCreate,
  onSearch,
}: {
  onNavigate: (screen: string) => void;
  onCreate: () => void;
  onSearch: (query: string) => void;
}) {
  return (
    <Surface className="production-shortcuts">
      <ContextualAIBar
        placeholder="Buscar no extrato…"
        musicIcon={<Layers size={18} />}
        sparkleIcon={<Search size={18} />}
        onSubmit={onSearch}
        tools={[
          <button
            type="button"
            key="new"
            aria-label="Novo lançamento"
            onClick={onCreate}
          >
            <Plus size={19} />
          </button>,
          <button
            type="button"
            key="agenda"
            aria-label="Abrir agenda"
            onClick={() => onNavigate("agenda")}
          >
            <CalendarDays size={19} />
          </button>,
          <button
            type="button"
            key="account"
            aria-label="Abrir contas"
            onClick={() => onNavigate("accounts")}
          >
            <Wallet size={19} />
          </button>,
          <button
            type="button"
            key="goal"
            aria-label="Abrir metas"
            onClick={() => onNavigate("goals")}
          >
            <Target size={19} />
          </button>,
        ]}
      />
    </Surface>
  );
}

export function FocusDisclosure({
  enabled,
  agenda,
  onToggle,
  onAgenda,
}: {
  enabled: boolean;
  agenda: boolean;
  onToggle: (enabled: boolean) => void;
  onAgenda: (enabled: boolean) => void;
}) {
  return (
    <Surface className="production-focus">
      <SwitchDisclosure
        enabled={enabled}
        subOptionChecked={agenda}
        title="Modo foco"
        subOptionLabel="Exibir agenda no painel"
        defaultEnabled={enabled}
        defaultSubOptionChecked={agenda}
        onToggleChange={onToggle}
        onSubOptionChange={onAgenda}
      />
      <p className="production-hint">
        Prioriza entregas, acordos e compromissos no seu painel.
      </p>
    </Surface>
  );
}

export function BalanceMap({
  accounts,
  format,
}: {
  accounts: {
    id: string;
    title: string;
    balance: number;
    free: number;
    reserved: number;
    goals: number;
    action: () => void;
  }[];
  format: (value: number) => string;
}) {
  if (!accounts.length) return null;
  return (
    <Surface className="production-map">
      <ViewOnMap
        buttonLabel="Mapa do saldo"
        content={
          <>
            <span className="eyebrow">CADA PARTE TEM UM LUGAR</span>
            <h2>Seu dinheiro por conta</h2>
            <p>Reserva e metas já fazem parte do saldo.</p>
            {accounts.map((a) => (
              <section key={a.id}>
                <h3>
                  {a.title} <b>{format(a.balance)}</b>
                </h3>
                <dl>
                  <div>
                    <dt>Disponível</dt>
                    <dd>{format(a.free)}</dd>
                  </div>
                  <div>
                    <dt>Reserva</dt>
                    <dd>{format(a.reserved)}</dd>
                  </div>
                  <div>
                    <dt>Metas</dt>
                    <dd>{format(a.goals)}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  className="text-button"
                  onClick={a.action}
                >
                  Ajustar reserva <ArrowUpRight size={14} />
                </button>
              </section>
            ))}
          </>
        }
      />
    </Surface>
  );
}

export function FinanceHelp() {
  return (
    <Surface className="production-help">
      <AccordionApp
        items={[
          {
            id: 1,
            title: "Onde meus dados ficam?",
            icon: <LockKeyhole size={20} />,
            content:
              "Nesta versão web, seus dados financeiros ficam no armazenamento local deste navegador. Apagar os dados do site pode remover seus registros: exporte backups regularmente. O olho oculta valores na tela; ele não funciona como senha ou criptografia. Não há conexão bancária automática.",
          },
          {
            id: 2,
            title: "Como as parcelas se ajustam?",
            icon: <CalendarDays size={20} />,
            content:
              "R$ 1.000 em 10 parcelas: R$ 100 cada. Se você registrar R$ 80 na primeira, a segunda passa a R$ 120 e mostra o motivo. O total continua R$ 1.000. Se houver saldo ao fechar a última, uma parcela extra aparece até a quitação.",
          },
          {
            id: 3,
            title: "O que um link compartilha?",
            icon: <ShieldCheck size={20} />,
            content:
              "Somente título, valores, datas e pagamentos da seção escolhida. Contas, metas, reserva, notas privadas e endereços ficam fora do link. O acesso é de leitura e pode ser encaminhado: trate o link como uma chave e revogue quando precisar. A publicação requer conexão; o restante do aplicativo funciona offline.",
          },
          {
            id: 4,
            title: "Aportes aumentam meu saldo?",
            icon: <Target size={20} />,
            content:
              "Metas e reserva são partes do saldo das suas contas. Organizar um aporte não aumenta o patrimônio. Registre uma receita antes de reservar dinheiro novo. O progresso das metas acompanha os aportes e resgates efetivamente registrados.",
          },
          {
            id: 5,
            title: "Como são calculadas as entregas?",
            icon: <CircleHelp size={20} />,
            content:
              "O bruto é a receita; o líquido desconta os custos informados na entrega. Ganhos por km usam a distância que você informar. O resultado do painel considera também suas outras receitas e despesas. Endereços são opcionais e locais, sem rastreamento automático.",
          },
        ]}
      />
    </Surface>
  );
}

export function ContributionPlanner({
  accounts,
  parse,
  format,
}: {
  accounts: {
    id: string;
    title: string;
    available: number;
    allocated: number;
  }[];
  parse: (value: string) => number;
  format: (value: number) => string;
}) {
  const [account, setAccount] = useState("");
  const [direction, setDirection] = useState("add");
  const [amount, setAmount] = useState("");
  const selected = accounts.find((item) => item.id === account);
  const limit = Math.max(
    0,
    selected
      ? direction === "add"
        ? selected.available
        : selected.allocated
      : 0,
  );
  let cents = 0;
  try {
    cents = parse(amount);
  } catch {
    /* The existing form validation explains invalid typed amounts on submit. */
  }
  return (
    <Surface className="production-contribution">
      <label className="field">
        <span>Operação</span>
        <select
          aria-label="Operação"
          name="direction"
          value={direction}
          onChange={(event) => {
            setDirection(event.target.value);
            setAmount("");
          }}
        >
          <option value="add">Separar dinheiro para a meta</option>
          <option value="remove">Resgatar para saldo livre</option>
        </select>
      </label>
      <label className="field">
        <span>Conta bancária *</span>
        <select
          aria-label="Conta bancária"
          name="accountId"
          required
          value={account}
          onChange={(event) => {
            setAccount(event.target.value);
            setAmount("");
          }}
        >
          <option value="">Escolha a conta</option>
          {accounts.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Valor (R$) *</span>
        <input
          aria-label="Valor (R$)"
          name="amount"
          inputMode="decimal"
          placeholder="0,00"
          required
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </label>
      <AdaptiveSlider
        label={direction === "add" ? "Planejar aporte" : "Planejar resgate"}
        value={Math.max(0, Math.min(limit, cents))}
        min={0}
        max={Math.max(1, limit)}
        step={1}
        disabled={!selected || limit === 0}
        formatValue={(value) => (value / 100).toFixed(2).replace(".", ",")}
        unit="R$"
        onChange={(value) =>
          setAmount((value / 100).toFixed(2).replace(".", ","))
        }
      />
      <p className="production-hint">
        {selected
          ? `${direction === "add" ? "Saldo livre nesta conta" : "Reservado nesta meta e conta"}: ${format(limit)}. O valor só é registrado ao confirmar o formulário.`
          : "Escolha uma conta para planejar o valor. O registro acontece somente ao confirmar."}
      </p>
    </Surface>
  );
}
