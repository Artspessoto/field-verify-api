import { PrismaAuditsRepository } from "~/repositories/prisma/prisma-audits-repository";
import { OverrideAuditDecisionUseCase } from "~/use-cases/audits/override-audit-decision/override-audit-decision";

export function makeOverrideAuditsUseCase() {
  const auditsRepository = new PrismaAuditsRepository();
  const useCase = new OverrideAuditDecisionUseCase(auditsRepository);

  return useCase;
}
