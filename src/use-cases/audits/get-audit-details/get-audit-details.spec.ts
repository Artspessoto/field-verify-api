import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAuditsRepository } from "~/repositories/in-memory/in-memory-audits-repository";
import { GetAuditDetailsUseCase } from "./get-audit-details";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";

let auditsRepository: InMemoryAuditsRepository;
let system: GetAuditDetailsUseCase;

describe("Get Audit Details Use Case", () => {
  beforeEach(() => {
    auditsRepository = new InMemoryAuditsRepository();
    system = new GetAuditDetailsUseCase(auditsRepository);
  });

  it("should be able to get audit details by id", async () => {
    const createdAudit = await auditsRepository.create({
      merchant_id: "merchant-01",
      user_id: "agent-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
    });

    const { audit } = await system.execute({
      auditId: createdAudit.id,
      userId: createdAudit.user_id,
      userRole: "ADMIN",
    });

    expect(audit.id).toEqual(createdAudit.id);
    expect(audit.merchant_id).toBe("merchant-01");
    expect(audit.user_id).toBe("agent-01");
    expect(audit.check_in_lat).toBe(-22.643065);
  });

  it("should not be able to get details of a non-existing audit", async () => {
    await expect(() =>
      system.execute({
        auditId: "non-existing-audit-id",
        userId: "admin-1",
        userRole: "ADMIN",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
