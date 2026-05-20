import { PrismaMerchantsRepository } from "~/repositories/prisma/prisma-merchants-repository";
import { RegisterMerchantUseCase } from "~/use-cases/merchants/register-merchant";

export function makeRegisterMerchantUseCase() {
  const merchantRepository = new PrismaMerchantsRepository();
  const registerUseCase = new RegisterMerchantUseCase(merchantRepository);

  return registerUseCase;
}
