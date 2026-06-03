import { Audit, AuditStatus } from "@prisma/client";
import { IAuditsRepository } from "~/repositories/audits-repository";

export interface ISearchAuditsUseCaseReq {
  page: number;
  status?: AuditStatus;
}

export interface ISearchAuditsUseCaseRes {
  audits: Audit[];
  totalCount: number;
}

export class SearchAuditsUseCase {
  constructor(private auditsRepository: IAuditsRepository) {}

  async execute({
    page,
    status,
  }: ISearchAuditsUseCaseReq): Promise<ISearchAuditsUseCaseRes> {
    const [audits, totalCount] = await Promise.all([
      this.auditsRepository.findMany(page, status),
      this.auditsRepository.countMany(status),
    ]);

    return { audits, totalCount };
  }
}
