import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, List } from "lucide-react";
import { DiscreteTabs } from "./nexo-ui";
import { SlotPicker } from "./reference/SlotPicker";

export type AgendaItem = {
  id: string;
  date: string;
  title: string;
  amount: number;
  type: string;
  open: () => void;
};

const iso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const dateOf = (value: string) => new Date(`${value}T12:00:00`);
const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};
const startOfWeek = (date: Date) => addDays(date, -date.getDay());
const validDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(dateOf(value).getTime()) &&
  iso(dateOf(value)) === value;
const category = (type: string) =>
  type === "goal"
    ? "Meta"
    : ["income", "receive"].includes(type)
      ? "A receber"
      : "A pagar";

const nationalHoliday = (date: Date) => {
  const fixed = new Set(["01-01", "04-21", "05-01", "09-07", "10-12", "11-02", "11-15", "11-20", "12-25"]);
  return fixed.has(iso(date).slice(5));
};

function YearCalendar({ year, selected, today, items, onSelect, onMonth }: { year: number; selected: string; today: string; items: AgendaItem[]; onSelect: (value: string) => void; onMonth: (value: string) => void }) {
  return <div className="finance-calendar-year" aria-label={`Calendário de ${year}`}>
    {Array.from({ length: 12 }, (_, month) => {
      const first = startOfWeek(new Date(year, month, 1, 12));
      const days = Array.from({ length: 42 }, (_, i) => addDays(first, i));
      return <section className="finance-calendar-mini-month" key={month}>
        <button type="button" className="finance-calendar-mini-title" onClick={() => onMonth(`${year}-${String(month + 1).padStart(2, "0")}-01`)}>{new Date(year, month, 1).toLocaleDateString("pt-BR", { month: "long" })}</button>
        <div className="finance-calendar-mini-grid">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => <span key={`${day}${index}`}>{day}</span>)}
          {days.map(day => {
            const value = iso(day), inMonth = day.getMonth() === month, hasItems = items.some(item => item.date === value);
            return <button type="button" key={value} data-date={value} aria-label={day.toLocaleDateString("pt-BR", { dateStyle: "full" })} aria-pressed={value === selected} className={`${inMonth ? "" : "is-outside"} ${value === selected ? "is-selected" : ""} ${value === today ? "is-today" : ""} ${nationalHoliday(day) ? "is-holiday" : ""}`} onClick={() => onSelect(value)}>{day.getDate()}{hasItems && <i aria-hidden="true" />}</button>;
          })}
        </div>
      </section>;
    })}
  </div>;
}

export function FinanceCalendar({
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
  const [view, setView] = useState<"day" | "week" | "month" | "year">("month");
  const [scope, setScope] = useState("day");
  const [windows, setWindows] = useState([
    {
      id: "period",
      label: "Filtrar por intervalo",
      enabled: false,
      slots: [
        { id: "range", from: selected.slice(0, 7) + "-01", to: selected },
      ],
    },
  ]);
  const ranges = windows
    .filter((window) => window.enabled)
    .flatMap((window) => window.slots);
  const invalid = ranges.some(
    (range) =>
      !validDate(range.from) || !validDate(range.to) || range.from > range.to,
  );
  const filtered = invalid
    ? []
    : items.filter(
        (item) =>
          !ranges.length ||
          ranges.some(
            (range) => item.date >= range.from && item.date <= range.to,
          ),
      );
  const current = validDate(selected) ? dateOf(selected) : new Date();
  const today = iso(new Date());
  const first =
    view === "month" || view === "year"
      ? startOfWeek(new Date(current.getFullYear(), current.getMonth(), 1, 12))
      : view === "week" ? startOfWeek(current) : current;
  const count = view === "month" ? 42 : view === "day" ? 1 : 7;
  const days = Array.from({ length: count }, (_, i) => addDays(first, i));
  const eventsByDate = new Map<string, AgendaItem[]>();
  for (const item of filtered) {
    if (!validDate(item.date)) continue;
    const sameDay = eventsByDate.get(item.date);
    if (sameDay) sameDay.push(item);
    else eventsByDate.set(item.date, [item]);
  }
  const selectedItems = eventsByDate.get(selected) ?? [];
  const listedItems =
    scope === "next"
      ? filtered.filter((item) => item.date >= selected)
      : selectedItems;
  const title =
    view === "year"
      ? String(current.getFullYear())
      : view === "month"
      ? current.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
      : view === "week" ? `${first.toLocaleDateString("pt-BR", { day: "numeric", month: "short" })} – ${days[6].toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}` : current.toLocaleDateString("pt-BR", { dateStyle: "full" });
  const navigate = (offset: number) => view === "month" ? onMonth(offset) : view === "year" ? onSelect(`${current.getFullYear() + offset}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`) : onSelect(iso(addDays(current, offset * (view === "week" ? 7 : 1))));
  return (
    <section className="finance-calendar" aria-label="Agenda financeira">
      <header className="finance-calendar-toolbar">
        <div className="finance-calendar-title">
          <CalendarDays size={21} />
          <h2>Sua agenda</h2>
        </div>
        <div className="finance-calendar-navigation">
          <button type="button" onClick={() => onSelect(today)}>
            Hoje
          </button>
          <button
            type="button"
            aria-label={view === "year" ? "Ano anterior" : view === "month" ? "Mês anterior" : view === "week" ? "Semana anterior" : "Dia anterior"}
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={19} />
          </button>
          <button
            type="button"
            aria-label={view === "year" ? "Próximo ano" : view === "month" ? "Próximo mês" : view === "week" ? "Próxima semana" : "Próximo dia"}
            onClick={() => navigate(1)}
          >
            <ChevronRight size={19} />
          </button>
          <h3 aria-live="polite">{title}</h3>
        </div>
        <div
          className="finance-calendar-view"
          role="group"
          aria-label="Visualização do calendário"
        >
          <button type="button" aria-pressed={view === "day"} onClick={() => setView("day")}>Dia</button>
          <button
            type="button"
            aria-pressed={view === "week"}
            onClick={() => setView("week")}
          >Semana</button>
          <button
            type="button"
            aria-pressed={view === "month"}
            onClick={() => setView("month")}
          >
            Mês
          </button>
          <button type="button" aria-pressed={view === "year"} onClick={() => setView("year")}>Ano</button>
        </div>
        <label className="finance-calendar-date">
          Ir para a data
          <input
            aria-label="Ir para a data"
            type="text"
            inputMode="numeric"
            placeholder="AAAA-MM-DD"
            value={selected}
            onChange={(event) => {
              if (validDate(event.target.value)) onSelect(event.target.value);
            }}
          />
        </label>
      </header>
      <p className="finance-calendar-note">
        Parcelas, recorrências e prazos de metas · compromissos de dia inteiro
      </p>
      {view === "year" ? <YearCalendar year={current.getFullYear()} selected={selected} today={today} items={filtered} onSelect={onSelect} onMonth={value => { onSelect(value); setView("month"); }} /> : <div className={`finance-calendar-scroll finance-calendar-${view}`}>
        <div className="finance-calendar-grid" role="table" aria-label={title}>
          <div className="finance-calendar-weekdays" role="row">
            {Array.from({ length: 7 }, (_, index) => addDays(startOfWeek(current), index)).map((day) => (
              <div role="columnheader" key={iso(day)}>
                {day
                  .toLocaleDateString("pt-BR", { weekday: "short" })
                  .replace(".", "")}
              </div>
            ))}
          </div>
          {Array.from({ length: view === "day" ? 1 : count / 7 }, (_, week) => (
            <div className="finance-calendar-row" role="row" key={week}>
              {(view === "day" ? days : days.slice(week * 7, week * 7 + 7)).map((day) => {
                const value = iso(day);
                const entries = eventsByDate.get(value) ?? [];
                const max = view === "month" ? 3 : entries.length;
                const holiday = nationalHoliday(day);
                return (
                  <div
                    role="cell"
                    data-date={value}
                    className={`finance-calendar-day ${day.getMonth() !== current.getMonth() && view === "month" ? "is-outside" : ""} ${value === selected ? "is-selected" : ""} ${holiday ? "is-national-holiday" : ""}`}
                    key={value}
                  >
                    <button
                      type="button"
                      className={`finance-calendar-day-number ${value === today ? "is-today" : ""}`}
                      aria-label={`${day.toLocaleDateString("pt-BR", { dateStyle: "full" })}${holiday ? ", feriado nacional" : ""}, ${entries.length} compromissos`}
                      title={holiday ? "Feriado nacional" : undefined}
                      aria-current={value === today ? "date" : undefined}
                      aria-pressed={value === selected}
                      onClick={() => onSelect(value)}
                    >
                      {day.getDate()}
                    </button>
                    <div className="finance-calendar-events">
                      {entries.slice(0, max).map((item) => (
                        <button
                          type="button"
                          className={`finance-calendar-event event-${item.type}`}
                          key={`${item.type}-${item.id}-${item.date}`}
                          onClick={item.open}
                          title={`${category(item.type)}: ${item.title} · ${format(item.amount)}`}
                        >
                          <span>{item.title}</span>
                          <small>{format(item.amount)}</small>
                        </button>
                      ))}
                    </div>
                    {entries.length > max && (
                      <button
                        type="button"
                        className="finance-calendar-more"
                        onClick={() => onSelect(value)}
                      >
                        +{entries.length - max} mais
                      </button>
                    )}
                    {view === "week" && !entries.length && (
                      <small className="finance-calendar-empty-day">
                        Sem prazos
                      </small>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>}
      <details className="finance-calendar-filters">
        <summary>Filtrar datas da agenda</summary>
        <SlotPicker
          days={windows}
          inputType="date"
          defaultFrom={selected}
          defaultTo={selected}
          onUpdate={setWindows}
        />
        {invalid && (
          <p role="alert">
            Informe um intervalo com data final igual ou posterior à inicial.
          </p>
        )}
      </details>
      <section className="finance-calendar-details" aria-live="polite">
        <div
          className="finance-calendar-list-tabs"
          role="group"
          aria-label="Lista de compromissos"
        >
          <DiscreteTabs
            defaultTab="day"
            onTabChange={setScope}
            tabs={[
              {
                id: "day",
                label: "Dia selecionado",
                icon: <CalendarDays size={17} />,
              },
              {
                id: "next",
                label: "Próximos prazos",
                icon: <List size={17} />,
              },
            ]}
          />
        </div>
        <h3>
          {scope === "next" ? "A partir de " : ""}
          {current.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </h3>
        {listedItems.length ? (
          listedItems.map((item) => (
            <button
              type="button"
              key={`${item.type}-${item.id}-${item.date}`}
              onClick={item.open}
            >
              <span>
                <strong>{item.title}</strong>
                <small>
                  {category(item.type)} ·{" "}
                  {scope === "next"
                    ? dateOf(item.date).toLocaleDateString("pt-BR")
                    : "Dia inteiro"}
                </small>
              </span>
              <b>{format(item.amount)}</b>
            </button>
          ))
        ) : (
          <p className="muted">
            {scope === "next"
              ? "Nenhum prazo encontrado neste intervalo."
              : "Nenhum compromisso agendado para este dia."}
          </p>
        )}
      </section>
    </section>
  );
}
