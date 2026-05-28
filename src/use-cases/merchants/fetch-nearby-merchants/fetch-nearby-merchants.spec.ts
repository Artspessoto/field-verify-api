import { expect, describe, it, beforeEach } from "vitest";
import { FetchNearbyMerchantsUseCase } from "./fetch-nearby-merchants";
import { InMemoryMerchantsRepository } from "~/repositories/in-memory/in-memory-merchants-repository";

let merchantsRepository: InMemoryMerchantsRepository;
let system: FetchNearbyMerchantsUseCase;

describe("Fetch Nearby Merchants Use Case", () => {
  beforeEach(() => {
    merchantsRepository = new InMemoryMerchantsRepository();
    system = new FetchNearbyMerchantsUseCase(merchantsRepository);
  });

  it("should be able to fetch nearby merchants", async () => {
    await merchantsRepository.create({
      name: "Loja Teste",
      tax_identification: "11.111.111/0001-11",
      address: "Rua do Centro, 123",
      latitude: -22.6614,
      longitude: -50.4183,
    });

    await merchantsRepository.create({
      name: "Loja Muito Longe",
      tax_identification: "22.222.222/0001-22",
      address: "Avenida Paulista, 1000",
      latitude: -23.5505,
      longitude: -46.6333,
    });

    const { merchants } = await system.execute({
      userLatitude: -22.6614,
      userLongitude: -50.4183,
    });

    expect(merchants).toHaveLength(1);
    expect(merchants[0].name).toEqual("Loja Teste");
  });
});
