import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryMerchantsRepository } from "~/repositories/in-memory/in-memory-merchants-repository";
import { UpdateMerchantsInfoUseCase } from "./update-merchants-info";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";
import { IncompleteAddressUpdateError } from "~/use-cases/errors/incomplete-address-update-error";

let merchantsRepository: InMemoryMerchantsRepository;
let system: UpdateMerchantsInfoUseCase;

describe("Update Merchants Info Use Case", () => {
  beforeEach(() => {
    merchantsRepository = new InMemoryMerchantsRepository();
    system = new UpdateMerchantsInfoUseCase(merchantsRepository);
  });

  it("should be able to update merchant info completely", async () => {
    const createdMerchant = await merchantsRepository.create({
      name: "Old Store Name",
      address: "Old Address, 100",
      tax_identification: "11111111111111",
      latitude: 0,
      longitude: 0,
      is_active: true,
    });

    const { merchant } = await system.execute({
      id: createdMerchant.id,
      name: "New Serginho Store",
      address: "New Address, 200",
      latitude: -23.55052,
      longitude: -46.633308,
      isActive: false,
    });

    expect(merchant.name).toEqual("New Serginho Store");
    expect(merchant.address).toEqual("New Address, 200");
    expect(merchant.latitude).toEqual(-23.55052);
    expect(merchant.longitude).toEqual(-46.633308);
    expect(merchant.is_active).toEqual(false);
  });

  it("should be able to update only partial fields", async () => {
    const createdMerchant = await merchantsRepository.create({
      name: "Original Name",
      address: "Original Address",
      tax_identification: "22222222222222",
      latitude: -20.0,
      longitude: -40.0,
      is_active: true,
    });

    const { merchant } = await system.execute({
      id: createdMerchant.id,
      name: "Updated Name Only",
      isActive: false,
    });

    expect(merchant.name).toEqual("Updated Name Only");
    expect(merchant.is_active).toEqual(false);

    expect(merchant.address).toEqual("Original Address");
    expect(merchant.latitude).toEqual(-20.0);
    expect(merchant.longitude).toEqual(-40.0);
  });

  it("should not be able to update a non-existing merchant", async () => {
    await expect(() =>
      system.execute({
        id: "non-existing-id",
        name: "Ghost Store",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update address without providing both latitude and longitude", async () => {
    const createdMerchant = await merchantsRepository.create({
      name: "Test Store",
      tax_identification: "33333333333333",
      latitude: 0,
      longitude: 0,
    });

    //forgot latitude and longitude
    await expect(() =>
      system.execute({
        id: createdMerchant.id,
        address: "New Address without GPS",
      }),
    ).rejects.toBeInstanceOf(IncompleteAddressUpdateError);

    //forget longitude
    await expect(() =>
      system.execute({
        id: createdMerchant.id,
        address: "New Address with missing Longitude",
        latitude: -23.5,
      }),
    ).rejects.toBeInstanceOf(IncompleteAddressUpdateError);
  });
});
