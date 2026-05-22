import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryMerchantsRepository } from "~/repositories/in-memory/in-memory-merchants-repository";
import { RegisterMerchantUseCase } from "./register-merchant";
import { MerchantAlreadyExistsError } from "~/use-cases/errors/merchant-already-exists-error";

let merchantsRepository: InMemoryMerchantsRepository;
let system: RegisterMerchantUseCase;

describe("Register Merchant Use Case", () => {
  beforeEach(() => {
    merchantsRepository = new InMemoryMerchantsRepository();
    system = new RegisterMerchantUseCase(merchantsRepository);
  });

  it("should be able to register a new merchant and clean the tax identification", async () => {
    const { merchant } = await system.execute({
      name: "Bankly Store",
      address: "Rua Fictícia, 123",
      tax_identification: "12.345.678/0001-99",
      latitude: -23.55052,
      longitude: -46.633308,
    });

    expect(merchant.id).toEqual(expect.any(String));
    expect(merchant.name).toEqual("Bankly Store");
    expect(merchant.tax_identification).toEqual("12345678000199");
  });

  it("should not be able to register a merchant with an already existing tax identification", async () => {
    await system.execute({
      name: "Loja Dona Benta",
      address: "Avenida Central, 456",
      tax_identification: "98.765.432/0001-11",
      latitude: -23.55052,
      longitude: -46.633308,
    });

    await expect(() =>
      system.execute({
        name: "Datum Emporium Filial",
        address: "Avenida Secundária, 789",
        tax_identification: "98765432000111",
        latitude: -22.906847,
        longitude: -43.172896,
      }),
    ).rejects.toBeInstanceOf(MerchantAlreadyExistsError);
  });
});
