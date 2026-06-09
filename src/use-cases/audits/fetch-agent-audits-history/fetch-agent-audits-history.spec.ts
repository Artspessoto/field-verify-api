import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAuditsRepository } from "~/repositories/in-memory/in-memory-audits-repository";
import { FetchAgentAuditsHistoryUseCase } from "./fetch-agent-audits-history";

let auditsRepository: InMemoryAuditsRepository;
let system: FetchAgentAuditsHistoryUseCase;

describe("Fetch Agent Audits History Use Case", () => {
  beforeEach(() => {
    auditsRepository = new InMemoryAuditsRepository();
    system = new FetchAgentAuditsHistoryUseCase(auditsRepository);
  });

  it("should be able to fetch agent audits history", async () => {
    await auditsRepository.create({
      merchant_id: "merchant-01",
      user_id: "agent-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
    });

    await auditsRepository.create({
      merchant_id: "merchant-02",
      user_id: "agent-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
    });

    const { audits, totalCount } = await system.execute({
      userId: "agent-01",
      page: 1,
    });

    expect(totalCount).toBe(2);
    expect(audits).toHaveLength(2);
    expect(audits).toEqual([
      expect.objectContaining({ merchant_id: "merchant-01" }),
      expect.objectContaining({ merchant_id: "merchant-02" }),
    ]);
  });

  it("should fetch paginated agent audits history", async () => {
    //creating 22 audits to test pagination
    for (let i = 1; i <= 22; i++) {
      await auditsRepository.create({
        merchant_id: `merchant-${i}`,
        user_id: "agent-01",
        check_in_lat: -22.643065,
        check_in_long: -50.404885,
      });
    }

    const { audits, totalCount } = await system.execute({
      userId: "agent-01",
      page: 2, //fetching the second page
    });

    expect(totalCount).toBe(22);
    expect(audits).toHaveLength(2);
    expect(audits).toEqual([
      expect.objectContaining({ merchant_id: "merchant-21" }),
      expect.objectContaining({ merchant_id: "merchant-22" }),
    ]);
  });

  it("should only return audits belonging to the specified agent", async () => {
    //agent 1 audits
    await auditsRepository.create({
      merchant_id: "merchant-01",
      user_id: "agent-01",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
    });

    //agent 2 audits
    await auditsRepository.create({
      merchant_id: "merchant-02",
      user_id: "agent-02",
      check_in_lat: -22.643065,
      check_in_long: -50.404885,
    });

    const { audits, totalCount } = await system.execute({
      userId: "agent-01",
      page: 1,
    });

    expect(totalCount).toBe(1);
    expect(audits).toHaveLength(1);
    expect(audits[0].merchant_id).toBe("merchant-01");
  });

  it("should return an empty array if the agent has no audits", async () => {
    const { audits, totalCount } = await system.execute({
      userId: "agent-01",
      page: 1,
    });

    expect(totalCount).toBe(0);
    expect(audits).toHaveLength(0);
    expect(audits).toEqual([]);
  });
});
