export type SharedPayment = { amount: number; date: string };
export type SharedEntry = SharedPayment & {
  title: string;
  type: "income" | "expense";
};
export type SharedSection = {
  version: 1;
  title: string;
  kind: "receive" | "pay" | "ledger";
  total: number;
  count: number;
  start: string;
  updatedAt: string;
  payments: SharedPayment[];
  entries: SharedEntry[];
};
export type FirebaseGrant = {
  provider: "firebase";
  id: string;
  url: string;
  readKey: string;
  writeKey: string;
  syncedAt: string;
  error: string;
  persistent?: boolean;
};
export type SourceData = {
  sections: any[];
  entries: any[];
  sharing: { grants: Record<string, any> };
};
const money = (v: unknown) => {
  if (!Number.isSafeInteger(v) || Number(v) < 0 || Number(v) > 1e12)
    throw Error("Valor inválido na seção.");
  return Number(v);
};
const date = (v: unknown) => {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v))
    throw Error("Data inválida na seção.");
  return v;
};
export function projectSection(data: SourceData, id: string): SharedSection {
  const s = data.sections.find((x) => x.id === id);
  if (!s) throw Error("Seção não encontrada.");
  if (!["receive", "pay", "ledger"].includes(s.kind))
    throw Error("Tipo de seção inválido.");
  const entries = data.entries
    .filter((x) => x.sectionId === id && !x.paymentId)
    .map((x) => ({
      title: String(x.title).slice(0, 120),
      type: x.type,
      amount: money(x.amount),
      date: date(x.date),
    }));
  if (entries.some((x) => !["income", "expense"].includes(x.type)))
    throw Error("Tipo de lançamento inválido.");
  const payments = (s.payments ?? []).map((x: any) => ({
    amount: money(x.amount),
    date: date(x.date),
  }));
  if (payments.length > 1200 || entries.length > 1000)
    throw Error(
      "Esta seção ultrapassou o limite de registros para compartilhamento.",
    );
  return {
    version: 1,
    title: String(s.title).slice(0, 120),
    kind: s.kind,
    total: money(s.total ?? 0),
    count: Number(s.count ?? 0),
    start: s.start ? date(s.start) : "",
    updatedAt: new Date().toISOString(),
    payments,
    entries,
  };
}
export function schedule(section: SharedSection) {
  const { total, count, start, payments } = section;
  if (
    !Number.isSafeInteger(total) ||
    total <= 0 ||
    !Number.isInteger(count) ||
    count < 1 ||
    count > 600 ||
    !/^\d{4}-\d{2}-\d{2}$/.test(start)
  )
    throw Error("Parcelamento inválido.");
  const rows: {
    number: number;
    date: string;
    due: number;
    paid: number;
    closed: boolean;
    extra: boolean;
    carry: number;
  }[] = [];
  const base = Math.floor(total / count);
  const amounts = Array.from(
    { length: count },
    (_, i) => base + (i < total % count ? 1 : 0),
  );
  let remaining = total,
    carry = 0,
    index = 0;
  while (index < count || (remaining > 0 && index < payments.length + 1)) {
    const extra = index >= count,
      amount = extra ? 0 : amounts[index],
      due = Math.min(remaining, Math.max(0, amount + carry)),
      payment = payments[index];
    if (
      payment &&
      (!Number.isSafeInteger(payment.amount) ||
        payment.amount < 0 ||
        payment.amount > remaining)
    )
      throw Error("Pagamento inválido.");
    if (extra && !payment && remaining === 0) break;
    const paid = payment?.amount ?? 0,
      closed = !!payment || due === 0,
      nextCarry = closed ? (extra ? due - paid : amount + carry - paid) : 0;
    const [year, month, day] = start.split("-").map(Number),
      d = new Date(year, month - 1 + index, 1, 12),
      last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(Math.min(day, last)).padStart(2, "0")}`;
    rows.push({
      number: index + 1,
      date,
      due,
      paid,
      closed,
      extra,
      carry: nextCarry,
    });
    remaining -= paid;
    carry = closed ? (extra ? remaining : nextCarry) : 0;
    index++;
    if (index > payments.length + count + 1) break;
  }
  return {
    rows,
    remaining,
    paid: total - remaining,
    progress: (total - remaining) / total,
  };
}
