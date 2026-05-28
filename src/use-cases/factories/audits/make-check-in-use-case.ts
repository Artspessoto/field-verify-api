import { PrismaAuditsRepository } from "~/repositories/prisma/prisma-audits-repository";
import { PrismaMerchantsRepository } from "~/repositories/prisma/prisma-merchants-repository";
import { PrismaUsersRepository } from "~/repositories/prisma/prisma-users-repository";
import { CheckInUseCase } from "~/use-cases/audits/check-in/check-in";

export function makeCheckInUseCase() {
  const auditsRepository = new PrismaAuditsRepository();
  const merchantsRepository = new PrismaMerchantsRepository();
  const usersRepository = new PrismaUsersRepository();
  const useCase = new CheckInUseCase(
    auditsRepository,
    merchantsRepository,
    usersRepository,
  );

  return useCase;
}
