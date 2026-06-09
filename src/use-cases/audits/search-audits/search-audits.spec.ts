import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAuditsRepository } from "~/repositories/in-memory/in-memory-audits-repository";
import { SearchAuditsUseCase } from "./search-audits";

let auditsRepository: InMemoryAuditsRepository;
let system: SearchAuditsUseCase;

describe("Search Audits Use Case", () => {
  beforeEach(() => {
    auditsRepository = new InMemoryAuditsRepository();
    system = new SearchAuditsUseCase(auditsRepository);
  });

  it("should be able to search for all audits without filters", async () => {
    await auditsRepository.create({
      merchant_id: "merchant-01",
      user_id: "agent-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
    });

    await auditsRepository.create({
      merchant_id: "merchant-02",
      user_id: "agent-02", // Different agent
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
    });

    const { audits, totalCount } = await system.execute({
      page: 1,
    });

    expect(totalCount).toBe(2);
    expect(audits).toHaveLength(2);
    expect(audits).toEqual([
      expect.objectContaining({ merchant_id: "merchant-01" }),
      expect.objectContaining({ merchant_id: "merchant-02" }),
    ]);
  });

  it("should be able to fetch paginated audits", async () => {
    //creating 22 audits to test pagination boundary
    for (let i = 1; i <= 22; i++) {
      await auditsRepository.create({
        merchant_id: `merchant-${i}`,
        user_id: "agent-01",
        check_in_lat: -22.643065,
        check_in_long: -50.404885,
      });
    }

    const { audits, totalCount } = await system.execute({
      page: 2,
    });

    expect(totalCount).toBe(22);
    expect(audits).toHaveLength(2);
    expect(audits).toEqual([
      expect.objectContaining({ merchant_id: "merchant-21" }),
      expect.objectContaining({ merchant_id: "merchant-22" }),
    ]);
  });

  it("should be able to filter audits by status", async () => {
    //PENDING audit
    await auditsRepository.create({
      merchant_id: "merchant-01",
      user_id: "agent-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
      status: "PENDING",
    });

    //IN_REVIEW audits
    await auditsRepository.create({
      merchant_id: "merchant-02",
      user_id: "agent-02",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
      status: "IN_REVIEW",
    });

    await auditsRepository.create({
      merchant_id: "merchant-03",
      user_id: "agent-03",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
      status: "IN_REVIEW",
    });

    const { audits, totalCount } = await system.execute({
      page: 1,
      status: "IN_REVIEW",
    });

    expect(totalCount).toBe(2);
    expect(audits).toHaveLength(2);
    expect(audits).toEqual([
      expect.objectContaining({
        merchant_id: "merchant-02",
        status: "IN_REVIEW",
      }),
      expect.objectContaining({
        merchant_id: "merchant-03",
        status: "IN_REVIEW",
      }),
    ]);
  });

  it("should return an empty array if no audits match the filter criteria", async () => {
    await auditsRepository.create({
      merchant_id: "merchant-01",
      user_id: "agent-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
      status: "APPROVED",
    });

    const { audits, totalCount } = await system.execute({
      page: 1,
      status: "FRAUD_SUSPECT",
    });

    expect(totalCount).toBe(0);
    expect(audits).toHaveLength(0);
    expect(audits).toEqual([]);
  });
});
