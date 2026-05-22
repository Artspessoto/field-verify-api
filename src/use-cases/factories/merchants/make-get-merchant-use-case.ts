import { PrismaMerchantsRepository } from "~/repositories/prisma/prisma-merchants-repository";
import { GetMerchantDetailsUseCase } from "~/use-cases/merchants/get-merchant-details/get-merchant-details";

export function makeGetMerchantUseCase() {
  const merchantsRepository = new PrismaMerchantsRepository();
  const useCase = new GetMerchantDetailsUseCase(merchantsRepository);

  return useCase;
}
