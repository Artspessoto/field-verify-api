import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAuditsRepository } from "~/repositories/in-memory/in-memory-audits-repository";
import { EvaluateAuditUseCase } from "./evaluate-audit";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";
import { InvalidAuditStateError } from "~/use-cases/errors/invalid-audit-state-error";

let auditsRepository: InMemoryAuditsRepository;
let system: EvaluateAuditUseCase;

describe("Evaluate Audit Use Case", () => {
  beforeEach(() => {
    auditsRepository = new InMemoryAuditsRepository();
    system = new EvaluateAuditUseCase(auditsRepository);
  });

  it("should be able to approve an audit", async () => {
    const audit = await auditsRepository.create({
      merchant_id: "merchant-01",
      user_id: "agent-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
    });

    //event simulation: agent sent the pictures and audit for evaluate
    audit.status = "IN_REVIEW";
    await auditsRepository.save(audit);

    const { audit: evaluatedAudit } = await system.execute({
      auditId: audit.id,
      supervisorId: "supervisor-01",
      status: "APPROVED",
    });

    expect(evaluatedAudit.status).toBe("APPROVED");
    expect(evaluatedAudit.supervisor_id).toBe("supervisor-01");
    expect(evaluatedAudit.validated_at).toEqual(expect.any(Date));
    expect(evaluatedAudit.supervisor_review).toBeNull();
  });

  it("should be able to reject an audit and add a review note", async () => {
    const audit = await auditsRepository.create({
      merchant_id: "merchant-01",
      user_id: "agent-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
    });

    audit.status = "IN_REVIEW";
    await auditsRepository.save(audit);

    const { audit: evaluatedAudit } = await system.execute({
      auditId: audit.id,
      supervisorId: "supervisor-01",
      status: "REJECTED",
      supervisorReview:
        "Missing photo of the facade and illegible proof of address.",
    });

    expect(evaluatedAudit.status).toBe("REJECTED");
    expect(evaluatedAudit.supervisor_id).toBe("supervisor-01");
    expect(evaluatedAudit.supervisor_review).toBe(
      "Missing photo of the facade and illegible proof of address.",
    );
  });

  it("should be able to flag an audit as fraud suspect", async () => {
    const audit = await auditsRepository.create({
      merchant_id: "merchant-01",
      user_id: "agent-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
    });

    audit.status = "IN_REVIEW";
    await auditsRepository.save(audit);

    const { audit: evaluatedAudit } = await system.execute({
      auditId: audit.id,
      supervisorId: "supervisor-01",
      status: "FRAUD_SUSPECT",
      supervisorReview:
        "The establishment appears to be a shell company (vacant lot).",
    });

    expect(evaluatedAudit.status).toBe("FRAUD_SUSPECT");
    expect(evaluatedAudit.supervisor_review).toEqual(expect.any(String));
  });

  it("should not be able to evaluate a non-existing audit", async () => {
    await expect(() =>
      system.execute({
        auditId: "non-existing-audit-id",
        supervisorId: "supervisor-01",
        status: "APPROVED",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to evaluate an audit that is not IN_REVIEW", async () => {
    const audit = await auditsRepository.create({
      merchant_id: "merchant-01",
      user_id: "agent-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
    });

    await expect(() =>
      system.execute({
        auditId: audit.id,
        supervisorId: "supervisor-01",
        status: "APPROVED",
      }),
    ).rejects.toBeInstanceOf(InvalidAuditStateError);
  });
});
