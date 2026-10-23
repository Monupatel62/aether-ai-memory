export type MemoryScope = "principal" | "session" | "tenant";
export type MemoryClassification = "public" | "internal" | "sensitive";
export type RetentionClass = "ephemeral" | "short_lived" | "standard" | "legal_hold";

export interface MemoryRecordV1 {
  readonly schemaVersion: "1";
  readonly memoryId: string;
  readonly ownerPrincipalId: string;
  readonly scope: MemoryScope;
  readonly tenantId?: string;
  readonly sessionId?: string;
  /** Opaque reference to content held by an approved storage owner; never raw memory text. */
  readonly contentRef: string;
  readonly classification: MemoryClassification;
  readonly provenanceRef: string;
  readonly version: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly retentionClass: RetentionClass;
  readonly deletedAt?: string;
}

export type MemoryRecordIssueCode =
  | "unsupported_schema"
  | "invalid_identifier"
  | "scope_context_mismatch"
  | "content_reference_invalid"
  | "provenance_invalid"
  | "invalid_classification"
  | "invalid_retention"
  | "invalid_version"
  | "invalid_timestamp_order"
  | "invalid_deleted_at";

export interface MemoryRecordIssue {
  readonly code: MemoryRecordIssueCode;
  readonly path: string;
}

const ID = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,127}$/;
const REF = /^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,255}$/;

/** Validate metadata only. Does not authorize access, inspect referenced content, or persist deletion. */
export function validateMemoryRecord(record: MemoryRecordV1): readonly MemoryRecordIssue[] {
  const issues: MemoryRecordIssue[] = [];
  if (record.schemaVersion !== "1") issues.push({ code: "unsupported_schema", path: "/schemaVersion" });
  for (const [field, value] of [
    ["memoryId", record.memoryId],
    ["ownerPrincipalId", record.ownerPrincipalId]
  ] as const) {
    if (typeof value !== "string" || !ID.test(value)) issues.push({ code: "invalid_identifier", path: `/${field}` });
  }
  if (record.scope === "tenant") {
    if (typeof record.tenantId !== "string" || !ID.test(record.tenantId)) {
      issues.push({ code: "scope_context_mismatch", path: "/tenantId" });
    }
  } else if (record.tenantId !== undefined) {
    issues.push({ code: "scope_context_mismatch", path: "/tenantId" });
  }
  if (record.scope === "session") {
    if (typeof record.sessionId !== "string" || !ID.test(record.sessionId)) {
      issues.push({ code: "scope_context_mismatch", path: "/sessionId" });
    }
  } else if (record.sessionId !== undefined) {
    issues.push({ code: "scope_context_mismatch", path: "/sessionId" });
  }
  if (!REF.test(record.contentRef) || record.contentRef.startsWith("//")) {
    issues.push({ code: "content_reference_invalid", path: "/contentRef" });
  }
  if (!REF.test(record.provenanceRef)) issues.push({ code: "provenance_invalid", path: "/provenanceRef" });
  if (!["public", "internal", "sensitive"].includes(record.classification)) {
    issues.push({ code: "invalid_classification", path: "/classification" });
  }
  if (!["ephemeral", "short_lived", "standard", "legal_hold"].includes(record.retentionClass)) {
    issues.push({ code: "invalid_retention", path: "/retentionClass" });
  }
  if (!Number.isSafeInteger(record.version) || record.version < 1) issues.push({ code: "invalid_version", path: "/version" });
  const created = Date.parse(record.createdAt);
  const updated = Date.parse(record.updatedAt);
  if (!Number.isFinite(created) || !Number.isFinite(updated) || updated < created) {
    issues.push({ code: "invalid_timestamp_order", path: "/updatedAt" });
  }
  if (record.deletedAt !== undefined) {
    const deleted = Date.parse(record.deletedAt);
    if (!Number.isFinite(deleted) || deleted < updated) issues.push({ code: "invalid_deleted_at", path: "/deletedAt" });
  }
  return issues;
}
