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
const startOfWeek = (date: Date) => addDays(date, -((date.getDay() + 6) % 7));
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
  const [view, setView] = useState<"month" | "week">("month");
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
    view === "month"
      ? startOfWeek(new Date(current.getFullYear(), current.getMonth(), 1, 12))
      : startOfWeek(current);
  const count = view === "month" ? 42 : 7;
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
    view === "month"
      ? current.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
      : `${first.toLocaleDateString("pt-BR", { day: "numeric", month: "short" })} – ${days[6].toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}`;
  const navigate = (offset: number) =>
    view === "month"
      ? onMonth(offset)
      : onSelect(iso(addDays(current, offset * 7)));
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
            aria-label={view === "month" ? "Mês anterior" : "Semana anterior"}
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={19} />
          </button>
          <button
            type="button"
            aria-label={view === "month" ? "Próximo mês" : "Próxima semana"}
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
          <button
            type="button"
            aria-pressed={view === "month"}
            onClick={() => setView("month")}
          >
            Mês
          </button>
          <button
            type="button"
            aria-pressed={view === "week"}
            onClick={() => setView("week")}
          >
            Semana
          </button>
        </div>
        <label className="finance-calendar-date">
          Ir para a data
          <input
            aria-label="Ir para a data"
            type="date"
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
      <div className={`finance-calendar-scroll finance-calendar-${view}`}>
        <div className="finance-calendar-grid" role="table" aria-label={title}>
          <div className="finance-calendar-weekdays" role="row">
            {days.slice(0, 7).map((day) => (
              <div role="columnheader" key={iso(day)}>
                {day
                  .toLocaleDateString("pt-BR", { weekday: "short" })
                  .replace(".", "")}
              </div>
            ))}
          </div>
          {Array.from({ length: count / 7 }, (_, week) => (
            <div className="finance-calendar-row" role="row" key={week}>
              {days.slice(week * 7, week * 7 + 7).map((day) => {
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
      </div>
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
