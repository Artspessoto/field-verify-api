import { Audit, AuditStatus, Prisma } from "@prisma/client";

export interface IAuditsRepository {
  create(data: Prisma.AuditUncheckedCreateInput): Promise<Audit>;
  save(audit: Audit): Promise<Audit>;
  findById(id: string): Promise<Audit | null>;

  findMany(page: number, status?: AuditStatus): Promise<Audit[]>;
  countMany(status?: AuditStatus): Promise<number>;

  findManyByUserId(userId: string, page: number): Promise<Audit[]>;
  countManyByUserId(userId: string): Promise<number>;

  findPendingByUserId(userId: string): Promise<Audit | null>;
  findByAgentAndMerchantOnDate(
    userId: string,
    merchantId: string,
    date: Date,
  ): Promise<Audit | null>;
}
