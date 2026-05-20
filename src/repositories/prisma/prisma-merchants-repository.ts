import { Prisma, Merchant } from "@prisma/client";
import { IMerchantsRepository } from "../merchants-repository";
import prisma from "~/lib/prisma";

export class PrismaMerchantsRepository implements IMerchantsRepository {
  async create(data: Prisma.MerchantUncheckedCreateInput): Promise<Merchant> {
    const merchant = await prisma.merchant.create({ data });

    return merchant;
  }

  async save(merchant: Merchant): Promise<Merchant> {
    const updatedMerchant = await prisma.merchant.update({
      where: { id: merchant.id },
      data: merchant,
    });

    return updatedMerchant;
  }

  async findById(id: string): Promise<Merchant | null> {
    const merchant = await prisma.merchant.findUnique({
      where: { id },
    });

    return merchant;
  }

  async findByTaxIdentification(taxId: string): Promise<Merchant | null> {
    const validatedMerchant = await prisma.merchant.findUnique({
      where: { tax_identification: taxId },
    });

    return validatedMerchant;
  }

  async findManyNearby(data: {
    latitude: number;
    longitude: number;
  }): Promise<Merchant[]> {
    const { latitude, longitude } = data;

    //haversine formula (used in navigation and geodesy to calculate the shortest distance between two points of Earth)
    //6371: represent average radius of Earth in km (3959 for miles)
    //filter `<= 10`: restrict the search to a 10 km radius (6.21 for miles)
    const merchants = await prisma.$queryRaw<Merchant[]>`
    SELECT id, name, address, tax_identification, latitude, longitude, created_at, updated_at, is_active
    FROM merchants
    WHERE is_active = true
    AND ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;

    return merchants;
  }

  async findMany(
    query: string,
    page: number,
    isActive?: boolean,
  ): Promise<Merchant[]> {
    const merchants = await prisma.merchant.findMany({
      where: {
        is_active: isActive,
        OR: query
          ? [
              { name: { contains: query, mode: "insensitive" } },
              {
                address: { contains: query, mode: "insensitive" },
              },
              { tax_identification: { contains: query } },
            ]
          : undefined,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return merchants;
  }

  async countMany(query: string, isActive?: boolean): Promise<number> {
    const count = await prisma.merchant.count({
      where: {
        is_active: isActive,
        OR: query
          ? [
              { name: { contains: query, mode: "insensitive" } },
              {
                address: { contains: query, mode: "insensitive" },
              },
              { tax_identification: { contains: query } },
            ]
          : undefined,
      },
    });

    return count;
  }
}
