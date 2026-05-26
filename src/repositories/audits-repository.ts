import { Audit, AuditStatus, Prisma } from "@prisma/client";

export interface IAuditsRepository {
  create(data: Prisma.AuditUncheckedCreateInput): Promise<Audit>;
  save(audit: Audit): Promise<Audit>;
  findById(id: string): Promise<Audit | null>;
  findMany(page: number, status?: AuditStatus): Promise<Audit[]>;
  findManyByUserId(userId: string, page: number): Promise<Audit[]>;
  findPendingByUserId(userId: string): Promise<Audit | null>;
}
