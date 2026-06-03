import { PrismaAuditsRepository } from "~/repositories/prisma/prisma-audits-repository";
import { GetAuditDetailsUseCase } from "~/use-cases/audits/get-audit-details/get-audit-details";

export function makeGetAuditDetailsUseCase() {
  const auditsRepository = new PrismaAuditsRepository();
  const useCase = new GetAuditDetailsUseCase(auditsRepository);

  return useCase;
}
