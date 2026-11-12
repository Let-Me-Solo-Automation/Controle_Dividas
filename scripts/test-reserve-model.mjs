import { build } from 'esbuild';
import assert from 'node:assert/strict';

const bundled = await build({ entryPoints: ['src/lib/reserve-model.ts'], bundle: true, write: false, format: 'esm', platform: 'node' });
const model = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
const data = {
  accounts: [{ id: 'bank', title: 'Meu banco', initial: 100000 }],
  entries: [],
  goals: [{ target: 9000000, contributions: [{ accountId: 'bank', amount: 10000 }] }],
  reserve: [{ id: 'old', accountId: 'bank', amount: 20000 }],
};
const original = structuredClone(data);
model.changeReserve(data, { accountId: 'bank', type: 'deposit', amount: 15001, date: '2026-11-12', note: 'Primeiro aporte' });
model.changeReserve(data, { accountId: 'bank', type: 'deposit', amount: 999, date: '2026-11-12', note: 'Segundo aporte' });
model.changeReserve(data, { accountId: 'bank', type: 'withdrawal', amount: 6000, date: '2026-11-12', note: 'Emergência' });
assert.equal(model.actualBankBalance(data, 'bank'), 100000);
assert.equal(model.reserveForAccount(data, 'bank'), 30000);
assert.equal(model.freeBankBalance(data, 'bank'), 60000);
assert.deepEqual(data.entries, original.entries);
assert.equal(data.reserveTransactions.length, 4);
assert.equal(data.reserveTransactions[0].type, 'opening');
assert.equal(data.reserveTransactions[0].amount, 20000);
assert.match(data.reserveTransactions[0].note, /Saldo anterior/);
assert.deepEqual(data.reserveTransactions.slice(1).map(entry => entry.note), ['Primeiro aporte', 'Segundo aporte', 'Emergência']);
model.setReservePlan(data, { accountId: 'bank', target: 5000000, monthly: 10000 });
assert.equal(model.actualBankBalance(data, 'bank'), 100000);
assert.equal(model.freeBankBalance(data, 'bank'), 60000);
model.validateReserveMetadata(data);
for (const input of [
  { type: 'deposit', amount: 60001 },
  { type: 'withdrawal', amount: 30001 },
  { type: 'deposit', amount: 0.5 },
  { type: 'deposit', amount: -100 },
]) {
  const before = structuredClone(data);
  assert.throws(() => model.changeReserve(data, { accountId: 'bank', date: '2026-11-12', note: '', ...input }));
  assert.deepEqual(data, before);
}
const mismatch = structuredClone(data);
mismatch.reserve[0].amount++;
assert.throws(() => model.validateReserveMetadata(mismatch), /histórico/);
const duplicate = structuredClone(data);
duplicate.reserveTransactions.push(duplicate.reserveTransactions[1]);
assert.throws(() => model.validateReserveMetadata(duplicate));
assert.throws(() => model.setReservePlan(data, { accountId: 'bank', target: 1.5, monthly: 100 }));
const bankId = model.addBank(data, { title: 'Novo banco', initial: 12345, description: 'Conta real', icon: 'wallet' });
assert.equal(model.actualBankBalance(data, bankId), 12345);
assert.equal(model.freeBankBalance(data, bankId), 12345);
model.validateReserveMetadata(data);
console.log('Reserve: opening migration, repeated noted transactions, cents, limits, history integrity, actual wealth and plans passed.');
