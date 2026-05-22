import { IMerchantsRepository } from "~/repositories/merchants-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { Merchant } from "@prisma/client";
import { IncompleteAddressUpdateError } from "../errors/incomplete-address-update-error";

export interface IUpdateMerchantsInfoUseCaseReq {
  id: string;
  name?: string;
  address?: string | null;
  latitude?: number;
  longitude?: number;
  isActive?: boolean;
}

export class UpdateMerchantsInfoUseCase {
  constructor(private merchantsRepository: IMerchantsRepository) {}

  async execute({
    id,
    name,
    address,
    isActive,
    latitude,
    longitude,
  }: IUpdateMerchantsInfoUseCaseReq): Promise<{ merchant: Merchant }> {
    const merchant = await this.merchantsRepository.findById(id);

    if (!merchant) throw new ResourceNotFoundError();

    if (
      address !== undefined &&
      (latitude === undefined || longitude === undefined)
    ) {
      throw new IncompleteAddressUpdateError();
    }

    if (name !== undefined) merchant.name = name;
    if (address !== undefined) merchant.address = address;
    if (latitude !== undefined) merchant.latitude = latitude;
    if (longitude !== undefined) merchant.longitude = longitude;
    if (isActive !== undefined) merchant.is_active = isActive;

    const updatedMerchant = await this.merchantsRepository.save(merchant);

    return { merchant: updatedMerchant };
  }
}
