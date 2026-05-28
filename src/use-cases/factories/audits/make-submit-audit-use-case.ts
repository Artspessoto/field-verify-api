import { PrismaAuditsRepository } from "~/repositories/prisma/prisma-audits-repository";
import { PrismaUsersRepository } from "~/repositories/prisma/prisma-users-repository";
import { SubmitAuditUseCase } from "~/use-cases/audits/submit-audit/submit-audit";

export function makeSubmitAuditUseCase() {
  const auditsRepository = new PrismaAuditsRepository();
  const usersRepository = new PrismaUsersRepository();
  const useCase = new SubmitAuditUseCase(auditsRepository, usersRepository);

  return useCase;
}
