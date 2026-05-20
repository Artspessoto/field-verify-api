import { Merchant, Prisma } from "@prisma/client";

export interface IMerchantsRepository {
  create(data: Prisma.MerchantUncheckedCreateInput): Promise<Merchant>;
  save(merchant: Merchant): Promise<Merchant>;
  findById(id: string): Promise<Merchant | null>;
  findByTaxIdentification(taxId: string): Promise<Merchant | null>;
  findManyNearby(data: {
    latitude: number;
    longitude: number;
  }): Promise<Merchant[]>;
  findMany(
    query: string,
    page: number,
    isActive?: boolean,
  ): Promise<Merchant[]>;
  countMany(query: string, isActive?: boolean): Promise<number>;
}
