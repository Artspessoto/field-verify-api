import { PrismaAuditsRepository } from "~/repositories/prisma/prisma-audits-repository";
import { EvaluateAuditUseCase } from "~/use-cases/audits/evaluate-audit/evaluate-audit";

export function makeEvaluateAuditUseCase() {
  const auditsRepository = new PrismaAuditsRepository();
  const useCase = new EvaluateAuditUseCase(auditsRepository);

  return useCase;
}
