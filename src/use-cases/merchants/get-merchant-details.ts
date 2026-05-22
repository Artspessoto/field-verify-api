import { Merchant } from "@prisma/client";
import { IMerchantsRepository } from "~/repositories/merchants-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

export interface IGetMerchantDetailsUseCaseReq {
  merchantId: string;
}

export class GetMerchantDetailsUseCase {
  constructor(private merchantsRepository: IMerchantsRepository) {}

  async execute({
    merchantId,
  }: IGetMerchantDetailsUseCaseReq): Promise<{ merchant: Merchant }> {
    const merchant = await this.merchantsRepository.findById(merchantId);

    if (!merchant) throw new ResourceNotFoundError();

    return { merchant };
  }
}
