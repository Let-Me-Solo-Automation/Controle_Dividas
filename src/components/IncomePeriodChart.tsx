import { useState } from "react";
import { AnimatedFinanceChart } from "./AnimatedFinanceChart";
export function IncomePeriodChart({
  entries,
  range,
  scope,
  visible,
  kind,
}: {
  entries: any[];
  range: string[];
  scope: string;
  visible: boolean;
  kind: any;
}) {
  const [group, setGroup] = useState<"date" | "week">("date");
  const [start, end] = range,
    rows = entries.filter(
      (entry) =>
        entry.type === "income" && entry.date >= start && entry.date < end,
    );
  const buckets = new Map<string, number>();
  const day = new Date(start + "T12:00:00"),
    finish = new Date(end + "T12:00:00");
  while (day < finish) {
    const date = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    buckets.set(date, 0);
    day.setDate(day.getDate() + 1);
  }
  for (const row of rows)
    buckets.set(row.date, (buckets.get(row.date) || 0) + row.amount);
  const dates = Array.from(buckets.keys()),
    labels: string[] = [],
    values: number[] = [];
  const fmt = (date: string) =>
    new Date(date + "T12:00:00").toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      ...(scope === "year" ? { year: "numeric" as const } : {}),
    });
  if (group === "week") {
    for (let i = 0; i < dates.length; i += 7) {
      const chunk = dates.slice(i, i + 7);
      labels.push(`${fmt(chunk[0])} a ${fmt(chunk.at(-1)!)}`);
      values.push(
        chunk.reduce((sum, date) => sum + (buckets.get(date) || 0), 0),
      );
    }
  } else
    for (const [date, amount] of buckets) {
      labels.push(fmt(date));
      values.push(amount);
    }
  return (
    <div className="income-period-chart">
      <div
        className="chart-grouping"
        role="group"
        aria-label="Agrupar entradas"
      >
        <button
          type="button"
          aria-pressed={group === "date"}
          onClick={() => setGroup("date")}
        >
          Por data
        </button>
        <button
          type="button"
          aria-pressed={group === "week"}
          onClick={() => setGroup("week")}
        >
          Por semana
        </button>
      </div>
      <p className="muted">
        {group === "date"
          ? "Valores por data. Toque em um ponto para consultar."
          : "Somas em períodos de até 7 dias, a partir do início selecionado."}
      </p>
      <AnimatedFinanceChart
        key={`${start}-${end}-${group}`}
        values={values}
        labels={labels}
        visible={visible}
        kind={kind}
      />
    </div>
  );
}
