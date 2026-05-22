import { PrismaMerchantsRepository } from "~/repositories/prisma/prisma-merchants-repository";
import { UpdateMerchantsInfoUseCase } from "~/use-cases/merchants/update-merchants-info";

export function makeUpdateMerchantUseCase() {
  const merchantsRepository = new PrismaMerchantsRepository();
  const useCase = new UpdateMerchantsInfoUseCase(merchantsRepository);

  return useCase;
}
