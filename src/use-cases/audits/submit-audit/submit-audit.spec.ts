import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryAuditsRepository } from "~/repositories/in-memory/in-memory-audits-repository";
import { InMemoryUsersRepository } from "~/repositories/in-memory/in-memory-users-repository";
import { InMemoryMerchantsRepository } from "~/repositories/in-memory/in-memory-merchants-repository";
import { SubmitAuditUseCase } from "./submit-audit";
import { UnauthorizedAuditAccessError } from "~/use-cases/errors/unauthorized-audit-access-error";
import { AuditAlreadySubmittedError } from "~/use-cases/errors/audit-already-submitted-error";
import { MinimumPhotosRequiredError } from "~/use-cases/errors/minimum-photos-required-error";
import { MinimumStayTimeNotMetError } from "~/use-cases/errors/minimum-stay-time-not-meet-error";
import { MaxDistanceError } from "~/use-cases/errors/max-distance-error";

let auditsRepository: InMemoryAuditsRepository;
let usersRepository: InMemoryUsersRepository;
let merchantsRepository: InMemoryMerchantsRepository;
let system: SubmitAuditUseCase;

/**
 * GEOLOCATION MATH EXPLANATION (Distance Testing)
 * 1 degree of latitude ≈ 111.111 km.
 * + 0.0005 latitude ≈ 55 meters away (Passes the 100m max distance)
 * + 0.0023 latitude ≈ 255 meters away (Fails the 100m max distance)
 */
const MERCHANT_LAT = -22.643065;
const MERCHANT_LONG = -50.404885;

const VALID_AGENT_LAT = MERCHANT_LAT + 0.0005; //still at the location
const INVALID_AGENT_LAT = MERCHANT_LAT + 0.0023; //left the location

describe("Submit Audit Use Case", () => {
  beforeEach(async () => {
    auditsRepository = new InMemoryAuditsRepository();
    usersRepository = new InMemoryUsersRepository();
    merchantsRepository = new InMemoryMerchantsRepository();

    system = new SubmitAuditUseCase(
      auditsRepository,
      usersRepository,
      merchantsRepository,
    );

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

    await merchantsRepository.create({
      id: "merchant-01",
      name: "Supermercado Superbom",
      tax_identification: "00000000000000",
      latitude: MERCHANT_LAT,
      longitude: MERCHANT_LONG,
      is_active: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to submit an audit after 20 minutes while still at the location", async () => {
    //agent arrives at 10:00AM
    vi.setSystemTime(new Date(2026, 5, 5, 10, 0, 0));

    const audit = await auditsRepository.create({
      id: "audit-01",
      user_id: "agent-01",
      merchant_id: "merchant-01",
      check_in_lat: VALID_AGENT_LAT,
      check_in_long: MERCHANT_LONG,
      status: "PENDING",
      check_in_at: new Date(),
    });

    //fst-forward time to 10:21AM (21 minutes later)
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
      userLatitude: VALID_AGENT_LAT,
      userLongitude: MERCHANT_LONG,
    });

    expect(submittedAudit.status).toBe("IN_REVIEW");
    expect(submittedAudit.photos).toHaveLength(3);
  });

  it("should not be able to submit if the agent left the location (Distance > 100m)", async () => {
    vi.setSystemTime(new Date(2026, 5, 5, 10, 0, 0));

    const audit = await auditsRepository.create({
      id: "audit-01",
      user_id: "agent-01",
      merchant_id: "merchant-01",
      check_in_lat: VALID_AGENT_LAT,
      check_in_long: MERCHANT_LONG,
      status: "PENDING",
      check_in_at: new Date(),
    });

    //fast-forward time to 10:25AM
    vi.setSystemTime(new Date(2026, 5, 5, 10, 25, 0));

    //agent tries to submit from home
    await expect(() =>
      system.execute({
        userId: "agent-01",
        auditId: audit.id,
        photos: ["p1.jpg", "p2.jpg", "p3.jpg"],
        userLatitude: INVALID_AGENT_LAT, //> 100m away
        userLongitude: MERCHANT_LONG,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });

  it("should not be able to submit an audit before the 20 minutes minimum stay time", async () => {
    vi.setSystemTime(new Date(2026, 5, 5, 10, 0, 0));

    const audit = await auditsRepository.create({
      id: "audit-01",
      user_id: "agent-01",
      merchant_id: "merchant-01",
      check_in_lat: VALID_AGENT_LAT,
      check_in_long: MERCHANT_LONG,
      status: "PENDING",
      check_in_at: new Date(),
    });

    vi.setSystemTime(new Date(2026, 5, 5, 10, 15, 0)); //only 15 minutes later

    await expect(() =>
      system.execute({
        userId: "agent-01",
        auditId: audit.id,
        photos: ["photo-1.jpg", "photo-2.jpg", "photo-3.jpg"],
        userLatitude: VALID_AGENT_LAT,
        userLongitude: MERCHANT_LONG,
      }),
    ).rejects.toBeInstanceOf(MinimumStayTimeNotMetError);
  });

  it("should not be able to submit an audit with less than 3 photos", async () => {
    vi.setSystemTime(new Date(2026, 5, 5, 10, 0, 0));

    const audit = await auditsRepository.create({
      id: "audit-01",
      user_id: "agent-01",
      merchant_id: "merchant-01",
      check_in_lat: VALID_AGENT_LAT,
      check_in_long: MERCHANT_LONG,
      status: "PENDING",
      check_in_at: new Date(),
    });

    vi.setSystemTime(new Date(2026, 5, 5, 10, 25, 0));

    await expect(() =>
      system.execute({
        userId: "agent-01",
        auditId: audit.id,
        photos: ["frontage.jpg", "interior.jpg"], //just 2 photos
        userLatitude: VALID_AGENT_LAT,
        userLongitude: MERCHANT_LONG,
      }),
    ).rejects.toBeInstanceOf(MinimumPhotosRequiredError);
  });

  it("should not be able to submit an audit belonging to another agent", async () => {
    const audit = await auditsRepository.create({
      id: "audit-01",
      user_id: "another-agent-id",
      merchant_id: "merchant-01",
      check_in_lat: VALID_AGENT_LAT,
      check_in_long: MERCHANT_LONG,
    });

    await expect(() =>
      system.execute({
        userId: "agent-01",
        auditId: audit.id,
        photos: ["p1.jpg", "p2.jpg", "p3.jpg"],
        userLatitude: VALID_AGENT_LAT,
        userLongitude: MERCHANT_LONG,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedAuditAccessError);
  });

  it("should not be able to submit an audit that is already submitted", async () => {
    const audit = await auditsRepository.create({
      id: "audit-01",
      user_id: "agent-01",
      merchant_id: "merchant-01",
      check_in_lat: VALID_AGENT_LAT,
      check_in_long: MERCHANT_LONG,
      status: "IN_REVIEW",
      check_in_at: new Date(),
    });

    await expect(() =>
      system.execute({
        userId: "agent-01",
        auditId: audit.id,
        photos: ["p1.jpg", "p2.jpg", "p3.jpg"],
        userLatitude: VALID_AGENT_LAT,
        userLongitude: MERCHANT_LONG,
      }),
    ).rejects.toBeInstanceOf(AuditAlreadySubmittedError);
  });
});
