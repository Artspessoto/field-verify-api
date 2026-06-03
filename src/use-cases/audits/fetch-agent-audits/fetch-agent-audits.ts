import { Audit } from "@prisma/client";
import { IAuditsRepository } from "~/repositories/audits-repository";

export interface IFetchAgentAuditsUseCaseReq {
  userId: string;
  page: number;
}

export interface IFetchAgentAuditsUseCaseRes {
  audits: Audit[];
  totalCount: number;
}

export class FetchAgentAuditsUseCase {
  constructor(private auditsRepository: IAuditsRepository) {}

  async execute({
    userId,
    page,
  }: IFetchAgentAuditsUseCaseReq): Promise<IFetchAgentAuditsUseCaseRes> {
    const [audits, totalCount] = await Promise.all([
      this.auditsRepository.findManyByUserId(userId, page),
      this.auditsRepository.countManyByUserId(userId),
    ]);

    return { audits, totalCount };
  }
}
