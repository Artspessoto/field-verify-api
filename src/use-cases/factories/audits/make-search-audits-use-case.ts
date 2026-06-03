import { PrismaAuditsRepository } from "~/repositories/prisma/prisma-audits-repository";
import { SearchAuditsUseCase } from "~/use-cases/audits/search-audits/search-audits";

export function makeSearchAuditsUseCase() {
  const auditsRepository = new PrismaAuditsRepository();
  const useCase = new SearchAuditsUseCase(auditsRepository);

  return useCase;
}
