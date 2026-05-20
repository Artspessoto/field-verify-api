import { Merchant } from "@prisma/client";
import { IMerchantsRepository } from "~/repositories/merchants-repository";
import { MerchantAlreadyExistsError } from "../errors/merchant-already-exists-error";

export interface IRegisterMerchantUseCaseReq {
  name: string;
  address: string | null;
  tax_identification: string;
  latitude: number;
  longitude: number;
}

export class RegisterMerchantUseCase {
  constructor(private merchantsRepository: IMerchantsRepository) {}

  async execute(
    data: IRegisterMerchantUseCaseReq,
  ): Promise<{ merchant: Merchant }> {
    const cleanTaxIdentification = data.tax_identification.replace(/\D/g, "");

    const hasSameMerchant =
      await this.merchantsRepository.findByTaxIdentification(
        cleanTaxIdentification,
      );

    if (hasSameMerchant) throw new MerchantAlreadyExistsError();

    const merchant = await this.merchantsRepository.create({
      ...data,
      tax_identification: cleanTaxIdentification,
    });

    return { merchant };
  }
}
