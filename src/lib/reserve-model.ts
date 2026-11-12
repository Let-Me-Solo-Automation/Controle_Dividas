import { resizeIcon } from "./image-resize";
export type Bank = {
  id: string;
  title: string;
  initial: number;
  color?: string;
  description?: string;
  icon?: string;
  iconImage?: string;
  iconPositionX?: number;
  iconPositionY?: number;
};
export type ReserveTransaction = {
  id: string;
  accountId: string;
  type: "opening" | "deposit" | "withdrawal";
  amount: number;
  date: string;
  note: string;
};
export type ReservePlan = {
  accountId: string;
  target: number;
  monthly: number;
};
export type ReserveData = {
  accounts: Bank[];
  entries: {
    accountId: string;
    toAccountId?: string;
    type: string;
    amount: number;
  }[];
  goals: { contributions: { accountId: string; amount: number }[] }[];
  reserve: { id: string; accountId: string; amount: number }[];
  reserveTransactions?: ReserveTransaction[];
  reservePlans?: ReservePlan[];
};
export const bankIcons = ["bank", "wallet", "shield", "leaf", "star", "bradesco", "itau", "c6", "nubank", "inter", "santander", "bb", "caixa"] as const;
export const MAX_BANK_ICON_BYTES = 256 * 1024;
const cents = (value: unknown): value is number =>
  Number.isSafeInteger(value) && Math.abs(value as number) <= 1e12;
export const reserveToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
export const reserveForAccount = (data: ReserveData, accountId: string) =>
  data.reserve
    .filter((item) => item.accountId === accountId)
    .reduce((sum, item) => sum + item.amount, 0);
export function actualBankBalance(data: ReserveData, accountId: string) {
  return (
    (data.accounts.find((bank) => bank.id === accountId)?.initial || 0) +
    data.entries.reduce(
      (sum, entry) =>
        sum +
        (entry.accountId === accountId
          ? entry.type === "income"
            ? entry.amount
            : -entry.amount
          : 0) +
        (entry.type === "transfer" && entry.toAccountId === accountId
          ? entry.amount
          : 0),
      0,
    )
  );
}
export function freeBankBalance(data: ReserveData, accountId: string) {
  return (
    actualBankBalance(data, accountId) -
    reserveForAccount(data, accountId) -
    data.goals.reduce(
      (sum, goal) =>
        sum +
        goal.contributions
          .filter((item) => item.accountId === accountId)
          .reduce((total, item) => total + item.amount, 0),
      0,
    )
  );
}
export function reserveHistory(data: ReserveData): ReserveTransaction[] {
  return (
    data.reserveTransactions ??
    data.accounts.flatMap((bank) => {
      const amount = reserveForAccount(data, bank.id);
      return amount
        ? [
            {
              id: `opening-${bank.id}`,
              accountId: bank.id,
              type: "opening" as const,
              amount,
              date: reserveToday(),
              note: "Saldo anterior da reserva · histórico iniciado nesta data",
            },
          ]
        : [];
    })
  );
}
function validateBank(bank: Bank) {
  if (
    !bank.id ||
    typeof bank.title !== "string" ||
    !bank.title.trim() ||
    bank.title.length > 80 ||
    !cents(bank.initial) ||
    bank.initial < 0
  )
    throw Error("Banco inválido.");
  if (
    bank.description !== undefined &&
    (typeof bank.description !== "string" || bank.description.length > 240)
  )
    throw Error("Descrição do banco inválida.");
  if (
    bank.icon !== undefined &&
    !bankIcons.includes(bank.icon as (typeof bankIcons)[number])
  )
    throw Error("Ícone do banco inválido.");
  if (
    bank.iconImage !== undefined &&
    bank.iconImage !== "" &&
    (typeof bank.iconImage !== "string" ||
      !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(
        bank.iconImage,
      ) ||
      bank.iconImage.length > Math.ceil(MAX_BANK_ICON_BYTES / 3) * 4 + 40)
  )
    throw Error(
      "Imagem do banco inválida. Use PNG, JPEG ou WebP de até 256 KB.",
    );
  for (const key of ["iconPositionX", "iconPositionY"] as const)
    if (bank[key] !== undefined && (!Number.isFinite(bank[key]) || bank[key]! < 0 || bank[key]! > 100))
      throw Error("Enquadramento do ícone inválido.");
}
export function validateReserveMetadata(data: ReserveData) {
  for (const bank of data.accounts) validateBank(bank);
  const accounts = new Set(data.accounts.map((bank) => bank.id));
  if (data.reservePlans !== undefined) {
    if (!Array.isArray(data.reservePlans) || data.reservePlans.length > 50000)
      throw Error("Planejamento de reserva inválido.");
    const seen = new Set();
    for (const plan of data.reservePlans) {
      if (
        !plan ||
        !accounts.has(plan.accountId) ||
        seen.has(plan.accountId) ||
        !cents(plan.target) ||
        plan.target < 0 ||
        !cents(plan.monthly) ||
        plan.monthly < 0
      )
        throw Error("Planejamento de reserva inválido.");
      seen.add(plan.accountId);
    }
  }
  if (data.reserveTransactions !== undefined) {
    if (
      !Array.isArray(data.reserveTransactions) ||
      data.reserveTransactions.length > 50000
    )
      throw Error("Histórico da reserva inválido.");
    const seen = new Set();
    const totals = new Map<string, number>();
    for (const entry of data.reserveTransactions) {
      if (
        !entry ||
        typeof entry.id !== "string" ||
        !entry.id ||
        seen.has(entry.id) ||
        !accounts.has(entry.accountId) ||
        !["opening", "deposit", "withdrawal"].includes(entry.type) ||
        !cents(entry.amount) ||
        entry.amount <= 0 ||
        !validDate(entry.date) ||
        typeof entry.note !== "string" ||
        entry.note.length > 160
      )
        throw Error("Lançamento da reserva inválido.");
      seen.add(entry.id);
      const total =
        (totals.get(entry.accountId) || 0) +
        (entry.type === "withdrawal" ? -entry.amount : entry.amount);
      if (!cents(total) || total < 0)
        throw Error("Resgate superior ao saldo da reserva.");
      totals.set(entry.accountId, total);
    }
    for (const accountId of accounts)
      if ((totals.get(accountId) || 0) !== reserveForAccount(data, accountId))
        throw Error(
          "O histórico da reserva não corresponde ao saldo reservado.",
        );
  }
  return data;
}
export function addBank(data: ReserveData, input: Omit<Bank, "id">) {
  const bank = {
    ...input,
    title: input.title.trim(),
    description: input.description?.trim() || "",
    id: crypto.randomUUID(),
  };
  validateBank(bank);
  data.accounts.push(bank);
  return bank.id;
}
export function changeReserve(
  data: ReserveData,
  input: Omit<ReserveTransaction, "id" | "type"> & {
    type: "deposit" | "withdrawal";
  },
) {
  validateReserveMetadata(data);
  if (!data.accounts.some((bank) => bank.id === input.accountId))
    throw Error("Escolha um banco.");
  if (!cents(input.amount) || input.amount <= 0)
    throw Error("Informe um valor maior que zero, em centavos válidos.");
  if (
    !validDate(input.date) ||
    typeof input.note !== "string" ||
    input.note.length > 160
  )
    throw Error("Informe uma data válida e uma nota de até 160 caracteres.");
  if (input.type !== "deposit" && input.type !== "withdrawal")
    throw Error("Movimentação inválida.");
  if (
    input.type === "deposit" &&
    input.amount > freeBankBalance(data, input.accountId)
  )
    throw Error("O aporte supera o saldo disponível deste banco.");
  const before = reserveForAccount(data, input.accountId);
  if (input.type === "withdrawal" && input.amount > before)
    throw Error("O resgate supera a reserva deste banco.");
  const history = reserveHistory(data);
  const amount =
    before + (input.type === "deposit" ? input.amount : -input.amount);
  data.reserveTransactions = [
    ...history,
    { ...input, note: input.note.trim(), id: crypto.randomUUID() },
  ];
  data.reserve = data.reserve.filter(
    (entry) => entry.accountId !== input.accountId,
  );
  if (amount)
    data.reserve.push({
      id: crypto.randomUUID(),
      accountId: input.accountId,
      amount,
    });
}
export function setReservePlan(data: ReserveData, plan: ReservePlan) {
  if (
    !data.accounts.some((bank) => bank.id === plan.accountId) ||
    !cents(plan.target) ||
    plan.target < 0 ||
    !cents(plan.monthly) ||
    plan.monthly < 0
  )
    throw Error("Informe valores válidos para o planejamento.");
  data.reservePlans = [
    ...(data.reservePlans || []).filter(
      (item) => item.accountId !== plan.accountId,
    ),
    plan,
  ];
}
export async function readBankIcon(file: File) { return resizeIcon(file); }
