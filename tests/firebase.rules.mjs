import { test, before, after, beforeEach } from "node:test";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from "@firebase/rules-unit-testing";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  deleteField,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
let env;
const token = "a".repeat(48);
const section = {
  version: 1,
  title: "Acordo compartilhado",
  kind: "receive",
  total: 100000,
  count: 10,
  start: "2026-11-10",
  updatedAt: new Date().toISOString(),
  payments: [{ amount: 8000, date: "2026-11-11" }],
  entries: [],
};
const data = () => ({
  ownerUid: "owner",
  section,
  updatedAt: serverTimestamp(),
  expiresAt: null,
  revoked: false,
});
const revoke = () => ({
  revoked: true,
  section: deleteField(),
  updatedAt: serverTimestamp(),
  expiresAt: null,
});
before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-nexo-simulador",
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: await readFile("firebase/firestore.rules", "utf8"),
    },
  });
});
beforeEach(async () => env.clearFirestore());
after(async () => env?.cleanup());
test("owner publishes without expiry; public token reads work; listing remains denied", async () => {
  const owner = env.authenticatedContext("owner").firestore(),
    publicDb = env.unauthenticatedContext().firestore();
  await assertSucceeds(setDoc(doc(owner, "shares", token), data()));
  const snapshot = await assertSucceeds(getDoc(doc(publicDb, "shares", token)));
  assert.equal(snapshot.data().expiresAt, null);
  await assertFails(getDocs(collection(publicDb, "shares")));
  await assertFails(getDocs(collection(owner, "shares")));
});
test("only the owner can update or revoke; deletion cannot remove the permanent revocation marker", async () => {
  const owner = env.authenticatedContext("owner").firestore(),
    attacker = env.authenticatedContext("attacker").firestore(),
    publicDb = env.unauthenticatedContext().firestore();
  await assertSucceeds(setDoc(doc(owner, "shares", token), data()));
  await assertFails(
    setDoc(doc(attacker, "shares", token), { ...data(), ownerUid: "attacker" }),
  );
  await assertFails(updateDoc(doc(attacker, "shares", token), revoke()));
  await assertFails(updateDoc(doc(publicDb, "shares", token), revoke()));
  await assertFails(deleteDoc(doc(owner, "shares", token)));
  await assertFails(deleteDoc(doc(attacker, "shares", token)));
  await assertSucceeds(updateDoc(doc(owner, "shares", token), revoke()));
  await assertFails(getDoc(doc(publicDb, "shares", token)));
  const revoked = await getDoc(doc(owner, "shares", token));
  assert.equal(revoked.data().revoked, true);
  assert.equal(revoked.data().section, undefined);
});
test("a stale owner tab cannot resurrect a revoked link; sharing again requires a new token", async () => {
  const owner = env.authenticatedContext("owner").firestore(),
    publicDb = env.unauthenticatedContext().firestore();
  await setDoc(doc(owner, "shares", token), data());
  await updateDoc(doc(owner, "shares", token), revoke());
  await assertFails(setDoc(doc(owner, "shares", token), data()));
  await assertFails(
    updateDoc(doc(owner, "shares", token), { revoked: false, section }),
  );
  await assertSucceeds(updateDoc(doc(owner, "shares", token), revoke()));
  const nextToken = "b".repeat(48);
  await assertSucceeds(setDoc(doc(owner, "shares", nextToken), data()));
  await assertSucceeds(getDoc(doc(publicDb, "shares", nextToken)));
  await assertFails(getDoc(doc(publicDb, "shares", token)));
});
test("private fields, impersonation, invalid token and expiring new publications are rejected", async () => {
  const owner = env.authenticatedContext("owner").firestore();
  for (const invalid of [
    { ...data(), password: "private" },
    { ...data(), ownerUid: "other" },
    { ...data(), section: { ...section, privateNote: "private" } },
    { ...data(), expiresAt: Timestamp.fromMillis(Date.now() + 86400000) },
    { ...data(), revoked: true },
  ])
    await assertFails(setDoc(doc(owner, "shares", token), invalid));
  await assertFails(setDoc(doc(owner, "shares", "guessable"), data()));
  await assertFails(
    setDoc(
      doc(env.unauthenticatedContext().firestore(), "shares", token),
      data(),
    ),
  );
});
test("legacy links can be read until expiry and upgraded in place to no expiry", async () => {
  const legacy = {
    ...data(),
    expiresAt: Timestamp.fromMillis(Date.now() + 86400000),
  };
  delete legacy.revoked;
  await env.withSecurityRulesDisabled(async (ctx) =>
    setDoc(doc(ctx.firestore(), "shares", token), legacy),
  );
  const owner = env.authenticatedContext("owner").firestore(),
    publicDb = env.unauthenticatedContext().firestore();
  await assertSucceeds(getDoc(doc(publicDb, "shares", token)));
  await assertSucceeds(setDoc(doc(owner, "shares", token), data()));
  assert.equal(
    (await getDoc(doc(publicDb, "shares", token))).data().expiresAt,
    null,
  );
});
test("expired legacy links stay private and their owners can revoke them", async () => {
  const legacy = {
    ...data(),
    expiresAt: Timestamp.fromMillis(Date.now() - 10000),
  };
  delete legacy.revoked;
  await env.withSecurityRulesDisabled(async (ctx) =>
    setDoc(doc(ctx.firestore(), "shares", token), legacy),
  );
  await assertFails(
    getDoc(doc(env.unauthenticatedContext().firestore(), "shares", token)),
  );
  await assertSucceeds(
    updateDoc(
      doc(env.authenticatedContext("owner").firestore(), "shares", token),
      revoke(),
    ),
  );
});
