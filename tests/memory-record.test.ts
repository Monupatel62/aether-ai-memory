import { describe, expect, it } from "vitest";
import { validateMemoryRecord } from "../src/index.js";
import type { MemoryRecordV1 } from "../src/index.js";

const record: MemoryRecordV1 = {
  schemaVersion: "1",
  memoryId: "mem-123",
  ownerPrincipalId: "user-123",
  scope: "session",
  sessionId: "session-123",
  contentRef: "blob:mem-123:v1",
  classification: "internal",
  provenanceRef: "conversation:conv-1",
  version: 1,
  createdAt: "2026-10-23T12:00:00.000Z",
  updatedAt: "2026-10-23T12:00:00.000Z",
  retentionClass: "short_lived"
};

describe("memory record metadata contract", () => {
  it("accepts a correctly scoped record with opaque content reference", () => {
    expect(validateMemoryRecord(record)).toEqual([]);
  });

  it("requires tenant/session context to match the declared scope", () => {
    expect(validateMemoryRecord({ ...record, scope: "tenant", tenantId: undefined } as unknown as MemoryRecordV1)
      .map(issue => issue.code)).toContain("scope_context_mismatch");
    expect(validateMemoryRecord({ ...record, scope: "principal", sessionId: "session-123" } as unknown as MemoryRecordV1)
      .map(issue => issue.code)).toContain("scope_context_mismatch");
  });

  it("rejects malformed references and invalid timestamp ordering", () => {
    const invalid = {
      ...record,
      contentRef: "//external-content",
      updatedAt: "2026-10-22T12:00:00.000Z",
      deletedAt: "invalid"
    };
    const codes = validateMemoryRecord(invalid).map(issue => issue.code);
    expect(codes).toContain("content_reference_invalid");
    expect(codes).toContain("invalid_timestamp_order");
    expect(codes).toContain("invalid_deleted_at");
  });

  it("requires monotonic version and valid retention metadata", () => {
    const invalid = { ...record, version: 0, retentionClass: "forever" } as unknown as MemoryRecordV1;
    const codes = validateMemoryRecord(invalid).map(issue => issue.code);
    expect(codes).toContain("invalid_version");
    expect(codes).toContain("invalid_retention");
  });
});
