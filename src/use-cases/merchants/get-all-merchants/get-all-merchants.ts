import { Merchant } from "@prisma/client";
import { IMerchantsRepository } from "~/repositories/merchants-repository";

export interface IGetAllMerchantsUseCaseReq {
  query: string;
  page: number;
  isActive?: boolean;
}

export interface IGetAllMerchantsUseCaseRes {
  merchants: Merchant[];
  totalCount: number;
}

export class GetAllMerchantsUseCase {
  constructor(private merchantsRepository: IMerchantsRepository) {}

  async execute({
    query,
    page,
    isActive,
  }: IGetAllMerchantsUseCaseReq): Promise<IGetAllMerchantsUseCaseRes> {
    const [merchants, totalCount] = await Promise.all([
      await this.merchantsRepository.findMany(query, page, isActive),
      await this.merchantsRepository.countMany(query, isActive),
    ]);

    return { merchants, totalCount };
  }
}
