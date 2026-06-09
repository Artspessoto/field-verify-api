import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAuditsRepository } from "~/repositories/in-memory/in-memory-audits-repository";
import { OverrideAuditDecisionUseCase } from "./override-audit-decision";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";
import { AuditNotEvaluatedError } from "~/use-cases/errors/audit-not-evaluated-error";

let auditsRepository: InMemoryAuditsRepository;
let system: OverrideAuditDecisionUseCase;

describe("Override Audit Decision Use Case", () => {
  beforeEach(() => {
    auditsRepository = new InMemoryAuditsRepository();
    system = new OverrideAuditDecisionUseCase(auditsRepository);
  });

  it("should be able to override a previously REJECTED audit to APPROVED", async () => {
    const audit = await auditsRepository.create({
      merchant_id: "merchant-01",
      user_id: "agent-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
    });

    audit.status = "REJECTED";
    audit.supervisor_id = "old-supervisor-id";
    audit.supervisor_review = "Missing documents.";
    await auditsRepository.save(audit);

    const { audit: overriddenAudit } = await system.execute({
      auditId: audit.id,
      supervisorId: "master-supervisor-01",
      newStatus: "APPROVED",
      justification:
        "Documents were sent via email. Overriding previous rejection.",
    });

    expect(overriddenAudit.status).toBe("APPROVED");
    expect(overriddenAudit.supervisor_id).toBe("master-supervisor-01");
    expect(overriddenAudit.supervisor_review).toBe(
      "Documents were sent via email. Overriding previous rejection.",
    );
    expect(overriddenAudit.validated_at).toEqual(expect.any(Date));
  });

  it("should be able to override a previously APPROVED audit to FRAUD_SUSPECT", async () => {
    const audit = await auditsRepository.create({
      merchant_id: "merchant-01",
      user_id: "agent-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
    });

    //audit that was wrongly approved
    audit.status = "APPROVED";
    await auditsRepository.save(audit);

    const { audit: overriddenAudit } = await system.execute({
      auditId: audit.id,
      supervisorId: "master-supervisor-01",
      newStatus: "FRAUD_SUSPECT",
      justification:
        "Risk team identified fake CNPJ post-approval. Locking account.",
    });

    expect(overriddenAudit.status).toBe("FRAUD_SUSPECT");
    expect(overriddenAudit.supervisor_review).toContain("fake CNPJ");
  });

  it("should not be able to override an audit that does not exist", async () => {
    await expect(() =>
      system.execute({
        auditId: "non-existing-audit-id",
        supervisorId: "supervisor-01",
        newStatus: "REJECTED",
        justification: "This should fail.",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to override an audit that is still PENDING", async () => {
    const audit = await auditsRepository.create({
      merchant_id: "merchant-01",
      user_id: "agent-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
      status: "PENDING", //agent is still at the location
    });

    await expect(() =>
      system.execute({
        auditId: audit.id,
        supervisorId: "supervisor-01",
        newStatus: "APPROVED",
        justification: "Trying to bypass the regular review process.",
      }),
    ).rejects.toBeInstanceOf(AuditNotEvaluatedError);
  });

  it("should not be able to override an audit that is currently IN_REVIEW", async () => {
    const audit = await auditsRepository.create({
      merchant_id: "merchant-01",
      user_id: "agent-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
    });

    //agent submitted photos, waiting for standard evaluation
    audit.status = "IN_REVIEW";
    await auditsRepository.save(audit);

    await expect(() =>
      system.execute({
        auditId: audit.id,
        supervisorId: "supervisor-01",
        newStatus: "REJECTED",
        justification:
          "Should use the standard evaluate function, not override.",
      }),
    ).rejects.toBeInstanceOf(AuditNotEvaluatedError);
  });
});
