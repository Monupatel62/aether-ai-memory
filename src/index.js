import { randomUUID } from "node:crypto";

const ID = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,255}$/;
const SCOPES = new Set(["user", "session"]);
export class MemoryError extends Error {
  constructor(code, message = "Memory operation failed") { super(message); this.name = "MemoryError"; this.code = code; }
}
function isRecord(value) { return value !== null && typeof value === "object" && !Array.isArray(value); }
function validId(value) { return typeof value === "string" && ID.test(value) && value.trim() === value; }
function principalOk(value) { return isRecord(value) && validId(value.id) && validId(value.tenantId); }
function validStoredMemory(value) {
  return isRecord(value) && validId(value.id) && validId(value.tenantId) && validId(value.ownerId)
    && SCOPES.has(value.scope) && validId(value.kind) && typeof value.content === "string"
    && Number.isSafeInteger(value.createdAt) && Number.isSafeInteger(value.expiresAt)
    && (value.deletedAt === null || Number.isSafeInteger(value.deletedAt))
    && (value.sessionId === null || validId(value.sessionId));
}

export function createMemoryService({ store, authorize, clock = () => Date.now(), maxContentBytes = 65_536, maxRetentionMs = 30 * 24 * 60 * 60 * 1000 }) {
  const required = ["create", "get", "list", "delete"];
  if (!store || required.some((method) => typeof store[method] !== "function")) throw new TypeError("Memory store adapter is incomplete");
  if (typeof authorize !== "function" || typeof clock !== "function") throw new TypeError("Authorization and clock adapters are required");
  if (!Number.isSafeInteger(maxContentBytes) || maxContentBytes < 1 || maxContentBytes > 1_048_576) throw new TypeError("maxContentBytes is invalid");
  if (!Number.isSafeInteger(maxRetentionMs) || maxRetentionMs < 60_000 || maxRetentionMs > 365 * 24 * 60 * 60 * 1000) throw new TypeError("maxRetentionMs is invalid");

  async function allowed(principal, action, memory) {
    try { return (await authorize({ principal, action, resource: { type: "memory", id: memory?.id ?? null, tenantId: principal.tenantId, ownerId: memory?.ownerId ?? principal.id, scope: memory?.scope ?? null } })) === true; }
    catch { return false; }
  }
  async function getActive(principal, memoryId) {
    let memory;
    try { memory = await store.get({ id: memoryId, tenantId: principal.tenantId }); } catch { throw new MemoryError("store_unavailable"); }
    if (memory !== null && memory !== undefined && !validStoredMemory(memory)) throw new MemoryError("store_unavailable");
    if (!memory || memory.tenantId !== principal.tenantId || memory.ownerId !== principal.id || memory.deletedAt !== null || memory.expiresAt <= clock()) {
      throw new MemoryError("not_found", "Memory was not found");
    }
    return memory;
  }

  return Object.freeze({
    async create({ principal, scope, sessionId, kind, content, retentionMs } = {}) {
      if (!principalOk(principal)) throw new MemoryError("unauthenticated");
      if (!SCOPES.has(scope) || !validId(kind)) throw new MemoryError("invalid_memory");
      if (scope === "session" && !validId(sessionId)) throw new MemoryError("session_required");
      if (scope === "user" && sessionId !== undefined) throw new MemoryError("invalid_memory");
      if (typeof content !== "string" || !content.trim() || new TextEncoder().encode(content).byteLength > maxContentBytes) throw new MemoryError("invalid_content");
      if (!Number.isSafeInteger(retentionMs) || retentionMs < 60_000 || retentionMs > maxRetentionMs) throw new MemoryError("invalid_retention");
      const at = clock();
      const record = Object.freeze({
        id: randomUUID(), tenantId: principal.tenantId, ownerId: principal.id,
        scope, sessionId: scope === "session" ? sessionId : null,
        kind, content, createdAt: at, expiresAt: at + retentionMs, deletedAt: null,
      });
      if (!await allowed(principal, "memory:create", record)) throw new MemoryError("forbidden");
      try { await store.create(record); } catch { throw new MemoryError("store_unavailable"); }
      return Object.freeze({ id: record.id, scope: record.scope, kind: record.kind, createdAt: record.createdAt, expiresAt: record.expiresAt });
    },

    async get({ principal, memoryId } = {}) {
      if (!principalOk(principal) || !validId(memoryId)) throw new MemoryError("unauthenticated");
      const memory = await getActive(principal, memoryId);
      if (!await allowed(principal, "memory:read", memory)) throw new MemoryError("not_found", "Memory was not found");
      return Object.freeze({ id: memory.id, scope: memory.scope, sessionId: memory.sessionId, kind: memory.kind, content: memory.content, createdAt: memory.createdAt, expiresAt: memory.expiresAt });
    },

    async list({ principal, scope = "user", sessionId, limit = 50 } = {}) {
      if (!principalOk(principal)) throw new MemoryError("unauthenticated");
      if (!SCOPES.has(scope) || (scope === "session" && !validId(sessionId))) throw new MemoryError("invalid_scope");
      if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) throw new MemoryError("invalid_limit");
      if (!await allowed(principal, "memory:list", { scope })) throw new MemoryError("forbidden");
      let records;
      try { records = await store.list({ tenantId: principal.tenantId, ownerId: principal.id, scope, sessionId: scope === "session" ? sessionId : null, limit }); }
      catch { throw new MemoryError("store_unavailable"); }
      if (!Array.isArray(records) || records.some((memory) => !validStoredMemory(memory))) throw new MemoryError("store_unavailable");
      const now = clock();
      return Object.freeze(records.filter((memory) => memory.tenantId === principal.tenantId && memory.ownerId === principal.id && memory.scope === scope && memory.deletedAt === null && memory.expiresAt > now && (scope !== "session" || memory.sessionId === sessionId))
        .slice(0, limit).map((memory) => Object.freeze({ id: memory.id, scope: memory.scope, sessionId: memory.sessionId, kind: memory.kind, content: memory.content, createdAt: memory.createdAt, expiresAt: memory.expiresAt })));
    },

    async delete({ principal, memoryId } = {}) {
      if (!principalOk(principal) || !validId(memoryId)) throw new MemoryError("unauthenticated");
      const memory = await getActive(principal, memoryId);
      if (!await allowed(principal, "memory:delete", memory)) throw new MemoryError("forbidden");
      try { await store.delete({ id: memory.id, tenantId: memory.tenantId, ownerId: memory.ownerId, deletedAt: clock() }); }
      catch { throw new MemoryError("store_unavailable"); }
      return Object.freeze({ id: memory.id, status: "deleted" });
    },
  });
}
