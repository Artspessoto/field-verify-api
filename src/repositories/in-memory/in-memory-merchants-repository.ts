import { Prisma, Merchant } from "@prisma/client";
import { IMerchantsRepository } from "../merchants-repository";
import { randomUUID } from "node:crypto";
import { getDistanceBetweenCoordinates } from "~/utils/get-distance-between-coordinates";

export class InMemoryMerchantsRepository implements IMerchantsRepository {
  public merchants: Merchant[] = [];

  async create(data: Prisma.MerchantUncheckedCreateInput): Promise<Merchant> {
    const merchant: Merchant = {
      id: data.id ?? randomUUID(),
      address: data.address ?? null,
      name: data.name,
      tax_identification: data.tax_identification,
      latitude: data.latitude,
      longitude: data.longitude,
      is_active: data.is_active ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.merchants.push(merchant);

    return merchant;
  }

  async save(merchant: Merchant): Promise<Merchant> {
    const merchantIndex = this.merchants.findIndex(
      (item) => item.id === merchant.id,
    );

    if (merchantIndex >= 0) {
      this.merchants[merchantIndex] = merchant;
    }

    return merchant;
  }

  async findById(id: string): Promise<Merchant | null> {
    const merchant = this.merchants.find((item) => item.id === id);

    if (!merchant) return null;

    return merchant;
  }

  async findByTaxIdentification(taxId: string): Promise<Merchant | null> {
    const validatedMerchant = this.merchants.find(
      (item) => item.tax_identification === taxId,
    );

    if (!validatedMerchant) return null;

    return validatedMerchant;
  }

  async findManyNearby(data: {
    latitude: number;
    longitude: number;
  }): Promise<Merchant[]> {
    const { latitude, longitude } = data;

    return this.merchants.filter((merchant) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        { latitude: merchant.latitude, longitude: merchant.longitude },
      );

      //return merchants than are less 10km distance (with merchant active filter)
      return distance < 10 && merchant.is_active === true;
    });
  }

  async findMany(
    query: string,
    page: number,
    isActive?: boolean,
  ): Promise<Merchant[]> {
    let filteredMerchants: Merchant[] = this.merchants;

    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredMerchants = filteredMerchants.filter(
        (merchant) =>
          merchant.name.toLowerCase().includes(lowerQuery) ||
          (merchant.address?.toLowerCase().includes(lowerQuery) ?? false) ||
          merchant.tax_identification.includes(query),
      );
    }

    //for accept false and true (merchants active and inactive for search)
    if (isActive !== undefined) {
      filteredMerchants = filteredMerchants.filter(
        (merchant) => merchant.is_active === isActive,
      );
    }

    return filteredMerchants.slice((page - 1) * 20, page * 20);
  }

  async countMany(query: string, isActive?: boolean): Promise<number> {
    let filteredMerchants = this.merchants;

    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredMerchants = filteredMerchants.filter(
        (merchant) =>
          merchant.name.toLowerCase().includes(lowerQuery) ||
          (merchant.address?.toLowerCase().includes(lowerQuery) ?? false) ||
          merchant.tax_identification.includes(query),
      );
    }

    if (isActive !== undefined)
      filteredMerchants = filteredMerchants.filter(
        (merchant) => merchant.is_active === isActive,
      );

    return filteredMerchants.length;
  }
}
