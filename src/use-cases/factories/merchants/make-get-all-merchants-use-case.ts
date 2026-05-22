import { PrismaMerchantsRepository } from "~/repositories/prisma/prisma-merchants-repository";
import { GetAllMerchantsUseCase } from "~/use-cases/merchants/get-all-merchants/get-all-merchants";

export function makeGetAllMerchantsUseCase() {
  const merchantsRepository = new PrismaMerchantsRepository();
  const useCase = new GetAllMerchantsUseCase(merchantsRepository);

  return useCase;
}
