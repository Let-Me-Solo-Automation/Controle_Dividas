export type PayoutPlan = {
  mode: "manual" | "weekly" | "interval";
  weekday: number;
  interval: number;
  anchor: string;
  icon?: string;
};
export function nextPayout(plan: PayoutPlan, now = new Date()): string | null {
  if (plan.mode === "manual") return null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  if (plan.mode === "weekly")
    today.setDate(
      today.getDate() + ((Number(plan.weekday) - today.getDay() + 7) % 7),
    );
  else {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(plan.anchor) ||
      !Number.isInteger(plan.interval) ||
      plan.interval < 1 ||
      plan.interval > 365
    )
      return null;
    const start = new Date(plan.anchor + "T12:00:00");
    if (!Number.isFinite(start.getTime())) return null;
    const days = Math.round((today.getTime() - start.getTime()) / 86400000);
    start.setDate(
      start.getDate() +
        Math.max(0, Math.ceil(days / plan.interval)) * plan.interval,
    );
    today.setTime(start.getTime());
  }
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}
export function platformTotals(data: any, name: string) {
  const rows = (data.deliveries || []).filter((d: any) => d.platform === name);
  const earned = rows.reduce((s: number, d: any) => s + d.amount, 0);
  const withdrawn = (data.deliveryWithdrawals || [])
    .filter((d: any) => d.platform === name)
    .reduce((s: number, d: any) => s + d.amount, 0);
  const pending=rows.filter((d:any)=>d.receiptStatus==='pending').reduce((sum:number,d:any)=>sum+d.amount,0);
  const credited=(data.deliveryWithdrawals||[]).filter((d:any)=>d.platform===name).reduce((sum:number,d:any)=>sum+(d.creditedAmount||0),0);
  return { earned, withdrawn, available: earned - withdrawn, pendingAvailable: pending-credited };
}
export function recordWithdrawal(
  data: any,
  input: { platform: string; amount: number; date: string; note: string; accountId?:string },
) {
  if (
    !data.platforms.includes(input.platform) ||
    !Number.isSafeInteger(input.amount) ||
    input.amount <= 0 ||
    input.amount > platformTotals(data, input.platform).available
  )
    throw Error("Informe um valor positivo até o saldo da plataforma.");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(input.date) ||
    new Date(input.date + "T12:00:00").toISOString().slice(0, 10) !== input.date
  )
    throw Error("Data inválida.");
  const creditedAmount=Math.min(input.amount,platformTotals(data,input.platform).pendingAvailable);
  if(creditedAmount>0&&!data.accounts?.some((bank:any)=>bank.id===input.accountId))throw Error('Escolha a conta que recebeu o repasse.');
  const id=crypto.randomUUID();
  (data.deliveryWithdrawals ??= []).push({...input,note:input.note.slice(0,160),id,creditedAmount});
  if(creditedAmount>0)data.entries.push({id:crypto.randomUUID(),deliveryPayoutId:id,title:'Repasse · '+input.platform,type:'income',amount:creditedAmount,date:input.date,accountId:input.accountId,category:'Entregas'});

}

export function validateDeliveryMetadata(data:any){
 if(data.deliveryWithdrawals===undefined)data.deliveryWithdrawals=[];
 if(!Array.isArray(data.deliveryWithdrawals)||data.deliveryWithdrawals.length>50000)throw Error('Histórico de retiradas inválido.');
 const ids=new Set();
 for(const row of data.deliveryWithdrawals){
  if(!row||typeof row.id!=='string'||ids.has(row.id)||!data.platforms.includes(row.platform)||!Number.isSafeInteger(row.amount)||row.amount<=0||typeof row.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(row.date)||typeof row.note!=='string'||row.note.length>160)throw Error('Retirada inválida.');
  if(row.creditedAmount && (!Number.isSafeInteger(row.creditedAmount)||row.creditedAmount<0||row.creditedAmount>row.amount||!data.accounts?.some((bank:any)=>bank.id===row.accountId)||!data.entries.some((entry:any)=>entry.deliveryPayoutId===row.id&&entry.amount===row.creditedAmount&&entry.accountId===row.accountId)))throw Error('Repasse bancário sem lançamento correspondente.');
  ids.add(row.id);
 }
 for(const platform of data.platforms)if(platformTotals(data,platform).available<0||platformTotals(data,platform).pendingAvailable<0)throw Error('Desfaça a retirada da plataforma antes de excluir as entregas que já foram repassadas.');
 return data;
}
