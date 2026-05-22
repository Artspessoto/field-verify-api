import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryMerchantsRepository } from "~/repositories/in-memory/in-memory-merchants-repository";
import { GetMerchantDetailsUseCase } from "./get-merchant-details";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";

let merchantsRepository: InMemoryMerchantsRepository;
let system: GetMerchantDetailsUseCase;

describe("Get Merchant Details Use Case", () => {
  beforeEach(() => {
    merchantsRepository = new InMemoryMerchantsRepository();
    system = new GetMerchantDetailsUseCase(merchantsRepository);
  });

  it("should be able to get merchant details", async () => {
    const createdMerchant = await merchantsRepository.create({
      name: "Supermercado Faustão",
      address: "Avenida Faria Lima, 1000",
      tax_identification: "12345678000199",
      latitude: -23.58941,
      longitude: -46.68087,
    });

    const { merchant } = await system.execute({
      merchantId: createdMerchant.id,
    });

    expect(merchant.id).toEqual(createdMerchant.id);
    expect(merchant.name).toEqual("Supermercado Faustão");
    expect(merchant.tax_identification).toEqual("12345678000199");
  });

  it("should not be able to get merchant details with a non-existing id", async () => {
    await expect(() =>
      system.execute({
        merchantId: "non-existing-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
