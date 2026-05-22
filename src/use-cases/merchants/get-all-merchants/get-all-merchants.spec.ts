import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryMerchantsRepository } from "~/repositories/in-memory/in-memory-merchants-repository";
import { GetAllMerchantsUseCase } from "./get-all-merchants";

let merchantsRepository: InMemoryMerchantsRepository;
let system: GetAllMerchantsUseCase;

describe("Get All Merchants Use Case", () => {
  beforeEach(() => {
    merchantsRepository = new InMemoryMerchantsRepository();
    system = new GetAllMerchantsUseCase(merchantsRepository);
  });

  it("should be able to fetch a list of active merchants", async () => {
    await merchantsRepository.create({
      name: "Pepsi Store",
      tax_identification: "11111111111111",
      latitude: 0,
      longitude: 0,
      is_active: true,
    });

    await merchantsRepository.create({
      name: "Inactive Store",
      tax_identification: "22222222222222",
      latitude: 0,
      longitude: 0,
      is_active: false,
    });

    const { merchants, totalCount } = await system.execute({
      query: "",
      page: 1,
      isActive: true,
    });

    expect(totalCount).toEqual(1);
    expect(merchants).toHaveLength(1);
    expect(merchants[0]).toEqual(
      expect.objectContaining({ name: "Pepsi Store" }),
    );
  });

  it("should be able to search merchants by query (name or document)", async () => {
    await merchantsRepository.create({
      name: "Dona Benta Store",
      tax_identification: "88888888888888",
      latitude: 0,
      longitude: 0,
    });

    await merchantsRepository.create({
      name: "Generic Market",
      tax_identification: "99999999999999",
      latitude: 0,
      longitude: 0,
    });

    const { merchants, totalCount } = await system.execute({
      query: "Dona",
      page: 1,
      isActive: true,
    });

    expect(totalCount).toEqual(1);
    expect(merchants).toHaveLength(1);
    expect(merchants[0].name).toEqual("Dona Benta Store");
  });

  it("should be able to fetch paginated merchants", async () => {
    for (let i = 1; i <= 22; i++) {
      await merchantsRepository.create({
        name: `Paginated Store ${i}`,
        tax_identification: `${i}0000000000000`,
        latitude: 0,
        longitude: 0,
      });
    }

    //find page 2
    const { merchants, totalCount } = await system.execute({
      query: "",
      page: 2,
      isActive: true,
    });

    expect(totalCount).toEqual(22);
    expect(merchants).toHaveLength(2);
    expect(merchants[0].name).toEqual("Paginated Store 21");
  });
});
