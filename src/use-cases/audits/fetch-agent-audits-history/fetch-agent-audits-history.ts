import { Audit } from "@prisma/client";
import { IAuditsRepository } from "~/repositories/audits-repository";

export interface IFetchAgentAuditsHistoryUseCaseReq {
  userId: string;
  page: number;
}

export interface IFetchAgentAuditsHistoryUseCaseRes {
  audits: Audit[];
  totalCount: number;
}

export class FetchAgentAuditsHistoryUseCase {
  constructor(private auditsRepository: IAuditsRepository) {}

  async execute({
    userId,
    page,
  }: IFetchAgentAuditsHistoryUseCaseReq): Promise<IFetchAgentAuditsHistoryUseCaseRes> {
    const [audits, totalCount] = await Promise.all([
      this.auditsRepository.findManyByUserId(userId, page),
      this.auditsRepository.countManyByUserId(userId),
    ]);

    return { audits, totalCount };
  }
}
