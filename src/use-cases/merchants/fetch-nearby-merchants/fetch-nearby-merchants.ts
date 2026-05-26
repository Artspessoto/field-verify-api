import { Merchant } from "@prisma/client";
import { IMerchantsRepository } from "~/repositories/merchants-repository";

export interface IFetchNearbyMerchantsUseCaseReq {
  userLatitude: number;
  userLongitude: number;
}

export class FetchNearbyMerchantsUseCase {
  constructor(private merchantsRepository: IMerchantsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: IFetchNearbyMerchantsUseCaseReq): Promise<{ merchants: Merchant[] }> {
    const merchants = await this.merchantsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return { merchants };
  }
}
