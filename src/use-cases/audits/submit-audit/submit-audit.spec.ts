import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryAuditsRepository } from "~/repositories/in-memory/in-memory-audits-repository";
import { InMemoryUsersRepository } from "~/repositories/in-memory/in-memory-users-repository";
import { SubmitAuditUseCase } from "./submit-audit";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";
import { UserDeactivatedError } from "~/use-cases/errors/user-deactivated-error";
import { UserEmailNotVerifiedError } from "~/use-cases/errors/user-email-not-verified-error";
import { UnauthorizedAuditAccessError } from "~/use-cases/errors/unauthorized-audit-access-error";
import { AuditAlreadySubmittedError } from "~/use-cases/errors/audit-already-submitted-error";
import { MinimumPhotosRequiredError } from "~/use-cases/errors/minimum-photos-required-error";
import { MinimumStayTimeNotMetError } from "~/use-cases/errors/minimum-stay-time-not-meet-error";

let auditsRepository: InMemoryAuditsRepository;
let usersRepository: InMemoryUsersRepository;
let system: SubmitAuditUseCase;

describe("Submit Audit Use Case", () => {
  beforeEach(async () => {
    auditsRepository = new InMemoryAuditsRepository();
    usersRepository = new InMemoryUsersRepository();
    system = new SubmitAuditUseCase(auditsRepository, usersRepository);

    vi.useFakeTimers();

    await usersRepository.create({
      id: "agent-01",
      name: "John Doe",
      email: "agent@example.com",
      password_hash: "hashed-123",
      document: "00000000000",
      role: "AGENT",
      is_active: true,
      email_verified_at: new Date(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to submit an audit after 20 minutes of stay with 3+ photos", async () => {
    vi.setSystemTime(new Date(2026, 5, 5, 10, 0, 0));

    const audit = await auditsRepository.create({
      id: "audit-01",
      user_id: "agent-01",
      merchant_id: "merchant-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
      status: "PENDING",
      check_in_at: new Date(),
    });

    //21 minutes later
    vi.setSystemTime(new Date(2026, 5, 5, 10, 21, 0));

    const { audit: submittedAudit } = await system.execute({
      userId: "agent-01",
      auditId: audit.id,
      photos: [
        "https://bucket/frontage.jpg",
        "https://bucket/interior.jpg",
        "https://bucket/address_proof.jpg",
      ],
      notes: "The establishment is operating normally.",
    });

    expect(submittedAudit.status).toBe("IN_REVIEW");
    expect(submittedAudit.photos).toHaveLength(3);
    expect(submittedAudit.notes).toEqual(expect.any(String));
  });

  it("should not be able to submit an audit before the 20 minutes minimum stay time", async () => {
    //agent arrives at 10:00 AM
    vi.setSystemTime(new Date(2026, 5, 5, 10, 0, 0));

    const audit = await auditsRepository.create({
      id: "audit-01",
      user_id: "agent-01",
      merchant_id: "merchant-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
      status: "PENDING",
      check_in_at: new Date(),
    });

    //just 15 minutes later
    vi.setSystemTime(new Date(2026, 5, 5, 10, 15, 0));

    await expect(() =>
      system.execute({
        userId: "agent-01",
        auditId: audit.id,
        photos: ["photo-1.jpg", "photo-2.jpg", "photo-3.jpg"],
      }),
    ).rejects.toBeInstanceOf(MinimumStayTimeNotMetError);
  });

  it("should not be able to submit an audit with less than 3 photos", async () => {
    //agent arrives at 10:00 AM
    vi.setSystemTime(new Date(2026, 5, 5, 10, 0, 0));

    const audit = await auditsRepository.create({
      id: "audit-01",
      user_id: "agent-01",
      merchant_id: "merchant-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
      status: "PENDING",
      check_in_at: new Date(),
    });

    //fast-forward time to 10:25AM (valid stay time)
    vi.setSystemTime(new Date(2026, 5, 5, 10, 25, 0));

    await expect(() =>
      system.execute({
        userId: "agent-01",
        auditId: audit.id,
        photos: ["frontage.jpg", "interior.jpg"], //just 2 photos provided
      }),
    ).rejects.toBeInstanceOf(MinimumPhotosRequiredError);
  });

  it("should not be able to submit an audit belonging to another agent", async () => {
    const audit = await auditsRepository.create({
      id: "audit-01",
      user_id: "another-agent-id",
      merchant_id: "merchant-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
    });

    await expect(() =>
      system.execute({
        userId: "agent-01",
        auditId: audit.id,
        photos: ["p1.jpg", "p2.jpg", "p3.jpg"],
      }),
    ).rejects.toBeInstanceOf(UnauthorizedAuditAccessError);
  });

  it("should not be able to submit an audit that is already submitted or evaluated", async () => {
    const audit = await auditsRepository.create({
      id: "audit-01",
      user_id: "agent-01",
      merchant_id: "merchant-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
      status: "IN_REVIEW",
      check_in_at: new Date(),
    });

    await expect(() =>
      system.execute({
        userId: "agent-01",
        auditId: audit.id,
        photos: ["p1.jpg", "p2.jpg", "p3.jpg"],
      }),
    ).rejects.toBeInstanceOf(AuditAlreadySubmittedError);
  });

  it("should not be able to submit if the user is deactivated", async () => {
    await usersRepository.create({
      id: "inactive-agent",
      name: "Inactive Doe",
      email: "inactive@example.com",
      password_hash: "hashed",
      document: "000",
      role: "AGENT",
      is_active: false,
      email_verified_at: new Date(),
    });

    const audit = await auditsRepository.create({
      id: "audit-01",
      user_id: "inactive-agent",
      merchant_id: "merchant-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
    });

    await expect(() =>
      system.execute({
        userId: "inactive-agent",
        auditId: audit.id,
        photos: ["p1.jpg", "p2.jpg", "p3.jpg"],
      }),
    ).rejects.toBeInstanceOf(UserDeactivatedError);
  });

  it("should not be able to submit if the user email is not verified", async () => {
    await usersRepository.create({
      id: "unverified-agent",
      name: "Unverified Doe",
      email: "unverified@example.com",
      password_hash: "hashed",
      document: "000",
      role: "AGENT",
      is_active: true,
      email_verified_at: null,
    });

    const audit = await auditsRepository.create({
      id: "audit-01",
      user_id: "unverified-agent",
      merchant_id: "merchant-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
    });

    await expect(() =>
      system.execute({
        userId: "unverified-agent",
        auditId: audit.id,
        photos: ["p1.jpg", "p2.jpg", "p3.jpg"],
      }),
    ).rejects.toBeInstanceOf(UserEmailNotVerifiedError);
  });

  it("should throw ResourceNotFoundError if audit or user does not exist", async () => {
    //missing audit
    await expect(() =>
      system.execute({
        userId: "agent-01",
        auditId: "non-existing-audit",
        photos: ["p1.jpg", "p2.jpg", "p3.jpg"],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);

    //missing user
    await auditsRepository.create({
      id: "audit-01",
      user_id: "agent-01",
      merchant_id: "merchant-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
    });

    await expect(() =>
      system.execute({
        userId: "non-existing-user",
        auditId: "audit-01",
        photos: ["p1.jpg", "p2.jpg", "p3.jpg"],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
