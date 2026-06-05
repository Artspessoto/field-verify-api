import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryAuditsRepository } from "~/repositories/in-memory/in-memory-audits-repository";
import { InMemoryMerchantsRepository } from "~/repositories/in-memory/in-memory-merchants-repository";
import { InMemoryUsersRepository } from "~/repositories/in-memory/in-memory-users-repository";
import { CheckInUseCase } from "./check-in";
import { ResourceNotFoundError } from "../../errors/resource-not-found-error";
import { CannotAuditInactiveMerchantError } from "../../errors/cannot-audit-inactive-merchant-error";
import { MaxDistanceError } from "../../errors/max-distance-error";
import { MaxDailyAuditsError } from "../../errors/max-daily-audits-error";
import { AgentHasPendingAuditError } from "../../errors/agent-has-pending-audit-error";
import { UserDeactivatedError } from "~/use-cases/errors/user-deactivated-error";
import { UserEmailNotVerifiedError } from "~/use-cases/errors/user-email-not-verified-error";

let auditsRepository: InMemoryAuditsRepository;
let merchantsRepository: InMemoryMerchantsRepository;
let usersRepository: InMemoryUsersRepository;
let system: CheckInUseCase;

/**
 * GEOLOCATION MATH EXPLANATION (Distance Testing)
 * 1 degree of latitude ≈ 111.111 km.
 * + 0.0005 latitude ≈ 55 meters away (Passes the 100m max distance)
 * + 0.0023 latitude ≈ 255 meters away (Fails the 100m max distance)
 */
const MERCHANT_LAT = -22.643065;
const MERCHANT_LONG = -50.404885;

const VALID_AGENT_LAT = MERCHANT_LAT + 0.0005;
const INVALID_AGENT_LAT = MERCHANT_LAT + 0.0023;

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    auditsRepository = new InMemoryAuditsRepository();
    merchantsRepository = new InMemoryMerchantsRepository();
    usersRepository = new InMemoryUsersRepository();
    system = new CheckInUseCase(
      auditsRepository,
      merchantsRepository,
      usersRepository,
    );

    await usersRepository.create({
      id: "user-01",
      name: "Arthur Spessoto",
      email: "arthur@example.com",
      password_hash: "123456",
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

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in within 100 meters", async () => {
    const { audit } = await system.execute({
      userId: "user-01",
      merchantId: "merchant-01",
      userLatitude: VALID_AGENT_LAT,
      userLongitude: MERCHANT_LONG,
    });

    expect(audit.id).toEqual(expect.any(String));
    expect(audit.merchant_id).toEqual("merchant-01");
  });

  it("should not be able to check in if distance is greater than 100 meters", async () => {
    await expect(() =>
      system.execute({
        userId: "user-01",
        merchantId: "merchant-01",
        userLatitude: INVALID_AGENT_LAT,
        userLongitude: MERCHANT_LONG,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });

  it("should not be able to check in twice on the same day for the same merchant", async () => {
    vi.setSystemTime(new Date(2026, 5, 5, 10, 0, 0)); //05/Jun/2026 10h00

    await system.execute({
      userId: "user-01",
      merchantId: "merchant-01",
      userLatitude: VALID_AGENT_LAT,
      userLongitude: MERCHANT_LONG,
    });

    //try make checkin in the same moment
    await expect(() =>
      system.execute({
        userId: "user-01",
        merchantId: "merchant-01",
        userLatitude: VALID_AGENT_LAT,
        userLongitude: MERCHANT_LONG,
      }),
    ).rejects.toBeInstanceOf(MaxDailyAuditsError);
  });

  it("should be able to check in on different days for the same merchant", async () => {
    vi.setSystemTime(new Date(2026, 5, 5, 10, 0, 0)); //day 05

    await system.execute({
      userId: "user-01",
      merchantId: "merchant-01",
      userLatitude: VALID_AGENT_LAT,
      userLongitude: MERCHANT_LONG,
    });

    vi.setSystemTime(new Date(2026, 5, 6, 10, 0, 0));

    auditsRepository.audits[0].status = "APPROVED";

    const { audit } = await system.execute({
      userId: "user-01",
      merchantId: "merchant-01",
      userLatitude: VALID_AGENT_LAT,
      userLongitude: MERCHANT_LONG,
    });

    expect(audit.id).toEqual(expect.any(String));
  });

  it("should not be able to check in if agent has another pending audit", async () => {
    await system.execute({
      userId: "user-01",
      merchantId: "merchant-01",
      userLatitude: VALID_AGENT_LAT,
      userLongitude: MERCHANT_LONG,
    });

    await merchantsRepository.create({
      id: "merchant-02",
      name: "Outro Supermercado",
      tax_identification: "11111111111111",
      latitude: MERCHANT_LAT,
      longitude: MERCHANT_LONG,
      is_active: true,
    });

    //try check-in in merchant-02 while merchant-01 is PENDING status
    await expect(() =>
      system.execute({
        userId: "user-01",
        merchantId: "merchant-02",
        userLatitude: VALID_AGENT_LAT,
        userLongitude: MERCHANT_LONG,
      }),
    ).rejects.toBeInstanceOf(AgentHasPendingAuditError);
  });

  it("should not be able to check in if user is deactivated", async () => {
    await usersRepository.create({
      id: "user-inactive",
      name: "Inactive User",
      email: "inactive@example.com",
      password_hash: "123456",
      document: "00000000000",
      role: "AGENT",
      is_active: false, // inativo
      email_verified_at: new Date(),
    });

    await expect(() =>
      system.execute({
        userId: "user-inactive",
        merchantId: "merchant-01",
        userLatitude: VALID_AGENT_LAT,
        userLongitude: MERCHANT_LONG,
      }),
    ).rejects.toBeInstanceOf(UserDeactivatedError);
  });

  it("should not be able to check in if user email is not verified", async () => {
    await usersRepository.create({
      id: "user-unverified",
      name: "Unverified User",
      email: "unverified@example.com",
      password_hash: "123456",
      document: "00000000000",
      role: "AGENT",
      is_active: true,
      email_verified_at: null,
    });

    await expect(() =>
      system.execute({
        userId: "user-unverified",
        merchantId: "merchant-01",
        userLatitude: VALID_AGENT_LAT,
        userLongitude: MERCHANT_LONG,
      }),
    ).rejects.toBeInstanceOf(UserEmailNotVerifiedError);
  });

  it("should not be able to check in an inactive merchant", async () => {
    await merchantsRepository.create({
      id: "merchant-inactive",
      name: "Loja Fechada",
      tax_identification: "22222222222222",
      latitude: MERCHANT_LAT,
      longitude: MERCHANT_LONG,
      is_active: false,
    });

    await expect(() =>
      system.execute({
        userId: "user-01",
        merchantId: "merchant-inactive",
        userLatitude: VALID_AGENT_LAT,
        userLongitude: MERCHANT_LONG,
      }),
    ).rejects.toBeInstanceOf(CannotAuditInactiveMerchantError);
  });

  it("should throw ResourceNotFoundError if user does not exist", async () => {
    await expect(() =>
      system.execute({
        userId: "non-existing-user",
        merchantId: "merchant-01",
        userLatitude: VALID_AGENT_LAT,
        userLongitude: MERCHANT_LONG,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should throw ResourceNotFoundError if merchant does not exist", async () => {
    await expect(() =>
      system.execute({
        userId: "user-01",
        merchantId: "non-existing-merchant",
        userLatitude: VALID_AGENT_LAT,
        userLongitude: MERCHANT_LONG,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
