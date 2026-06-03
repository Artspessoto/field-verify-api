import { PrismaAuditsRepository } from "~/repositories/prisma/prisma-audits-repository";
import { FetchAgentAuditsHistoryUseCase } from "~/use-cases/audits/fetch-agent-audits-history/fetch-agent-audits-history";

export function makeFetchAgentsAuditsUseCase() {
  const auditsRepository = new PrismaAuditsRepository();
  const useCase = new FetchAgentAuditsHistoryUseCase(auditsRepository);

  return useCase;
}
