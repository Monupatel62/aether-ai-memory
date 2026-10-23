import test from "node:test";
import assert from "node:assert/strict";
import { createMemoryService, MemoryError } from "../src/index.js";

function fixture(overrides = {}) {
  const records = new Map();
  let now = 1000;
  const store = {
    async create(record) { records.set(record.id, record); },
    async get({ id, tenantId }) { const value = records.get(id); return value?.tenantId === tenantId ? value : null; },
    async list({ tenantId, ownerId, scope, sessionId, limit }) { return [...records.values()].filter((v) => v.tenantId === tenantId && v.ownerId === ownerId && v.scope === scope && (scope !== "session" || v.sessionId === sessionId)).slice(0, limit); },
    async delete({ id, deletedAt }) { const value = records.get(id); records.set(id, { ...value, deletedAt }); },
  };
  const service = createMemoryService({ store, authorize: async () => true, clock: () => now, ...overrides });
  return { service, records, setNow(value) { now = value; } };
}
const principal = { id: "user-1", tenantId: "tenant-a" };

test("creates, reads, lists, and deletes scoped memory", async () => {
  const { service } = fixture();
  const created = await service.create({ principal, scope: "session", sessionId: "session-1", kind: "preference", content: "prefers concise answers", retentionMs: 60_000 });
  assert.equal((await service.get({ principal, memoryId: created.id })).content, "prefers concise answers");
  assert.equal((await service.list({ principal, scope: "session", sessionId: "session-1" })).length, 1);
  assert.equal((await service.delete({ principal, memoryId: created.id })).status, "deleted");
  await assert.rejects(service.get({ principal, memoryId: created.id }), (e) => e.code === "not_found");
});

test("requires explicit bounded retention and scope", async () => {
  const { service } = fixture();
  await assert.rejects(service.create({ principal, scope: "tenant", kind: "fact", content: "x", retentionMs: 60_000 }), MemoryError);
  await assert.rejects(service.create({ principal, scope: "user", kind: "fact", content: "x" }), (e) => e.code === "invalid_retention");
  await assert.rejects(service.create({ principal, scope: "session", kind: "fact", content: "x", retentionMs: 60_000 }), (e) => e.code === "session_required");
});

test("prevents cross-tenant and cross-user access", async () => {
  const { service } = fixture();
  const created = await service.create({ principal, scope: "user", kind: "fact", content: "private", retentionMs: 60_000 });
  await assert.rejects(service.get({ principal: { id: "user-2", tenantId: "tenant-a" }, memoryId: created.id }), (e) => e.code === "not_found");
  await assert.rejects(service.get({ principal: { id: "user-1", tenantId: "tenant-b" }, memoryId: created.id }), (e) => e.code === "not_found");
});

test("does not return expired memory", async () => {
  const { service, setNow } = fixture();
  const created = await service.create({ principal, scope: "user", kind: "fact", content: "short-lived", retentionMs: 60_000 });
  setNow(62_000);
  await assert.rejects(service.get({ principal, memoryId: created.id }), (e) => e.code === "not_found");
});

test("fails closed when authorization denies", async () => {
  const { service } = fixture({ authorize: async () => false });
  await assert.rejects(service.create({ principal, scope: "user", kind: "fact", content: "private", retentionMs: 60_000 }), (e) => e.code === "forbidden");
});
