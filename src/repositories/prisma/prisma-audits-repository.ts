import { Prisma, Audit, AuditStatus } from "@prisma/client";
import { IAuditsRepository } from "../audits-repository";
import prisma from "~/lib/prisma";
import dayjs from "dayjs";

export class PrismaAuditsRepository implements IAuditsRepository {
  async create(data: Prisma.AuditUncheckedCreateInput): Promise<Audit> {
    const audit = await prisma.audit.create({ data });

    return audit;
  }

  async save(audit: Audit): Promise<Audit> {
    const updatedAudit = await prisma.audit.update({
      where: { id: audit.id },
      data: audit,
    });

    return updatedAudit;
  }

  async findById(id: string): Promise<Audit | null> {
    const audit = await prisma.audit.findUnique({ where: { id } });

    return audit;
  }

  async findMany(page: number, status?: AuditStatus): Promise<Audit[]> {
    const audits = await prisma.audit.findMany({
      where: status ? { status } : undefined,
      take: 20,
      skip: (page - 1) * 20,
      orderBy: { check_in_at: "desc" },
    });

    return audits;
  }

  async countMany(status?: AuditStatus): Promise<number> {
    const count = await prisma.audit.count({
      where: status ? { status } : undefined,
    });

    return count;
  }

  async findManyByUserId(userId: string, page: number): Promise<Audit[]> {
    const audits = await prisma.audit.findMany({
      where: { user_id: userId },
      take: 20,
      skip: (page - 1) * 20,
      orderBy: { check_in_at: "desc" },
    });

    return audits;
  }

  async countManyByUserId(userId: string): Promise<number> {
    const count = await prisma.audit.count({
      where: { user_id: userId },
    });

    return count;
  }

  async findPendingByUserId(userId: string): Promise<Audit | null> {
    const audit = await prisma.audit.findFirst({
      where: { user_id: userId, status: "PENDING" },
    });

    return audit;
  }

  async findByAgentAndMerchantOnDate(
    userId: string,
    merchantId: string,
    date: Date,
  ): Promise<Audit | null> {
    const startOfTheDay = dayjs(date).startOf("date").toDate();
    const endOfTheDay = dayjs(date).endOf("date").toDate();

    const audit = await prisma.audit.findFirst({
      where: {
        user_id: userId,
        merchant_id: merchantId,
        check_in_at: {
          gte: startOfTheDay,
          lte: endOfTheDay,
        },
      },
    });

    return audit;
  }
}
