import { PrismaMerchantsRepository } from "~/repositories/prisma/prisma-merchants-repository";
import { FetchNearbyMerchantsUseCase } from "~/use-cases/merchants/fetch-nearby-merchants/fetch-nearby-merchants";

export function makeFetchNearbyMerchants() {
  const merchantsRepository = new PrismaMerchantsRepository();
  const useCase = new FetchNearbyMerchantsUseCase(merchantsRepository);

  return useCase;
}
