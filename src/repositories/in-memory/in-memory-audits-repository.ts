import { Prisma, Audit, AuditStatus } from "@prisma/client";
import { IAuditsRepository } from "../audits-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryAuditsRepository implements IAuditsRepository {
  audits: Audit[] = [];

  async create(data: Prisma.AuditUncheckedCreateInput): Promise<Audit> {
    const audit: Audit = {
      id: data.id ?? randomUUID(),
      status: data.status ?? "PENDING",
      check_in_at: data.check_in_at ? new Date(data.check_in_at) : new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      check_in_lat: data.check_in_lat,
      check_in_long: data.check_in_long,
      user_id: data.user_id,
      supervisor_id: data.supervisor_id ?? null,
      merchant_id: data.merchant_id,
      notes: data.notes ?? null,
      photos: Array.isArray(data.photos)
        ? data.photos
        : (data.photos?.set ?? []),
      supervisor_review: data.supervisor_review ?? null,
    };

    this.audits.push(audit);

    return audit;
  }

  async save(audit: Audit): Promise<Audit> {
    const auditIndex = this.audits.findIndex(
      (element) => element.id === audit.id,
    );

    if (auditIndex >= 0) this.audits[auditIndex] = audit;

    return audit;
  }

  async findById(id: string): Promise<Audit | null> {
    const audit = this.audits.find((item) => item.id === id);

    if (!audit) return null;

    return audit;
  }

  async findMany(page: number, status?: AuditStatus): Promise<Audit[]> {
    let filteredAudits = this.audits;

    if (status) {
      filteredAudits = filteredAudits.filter((item) => item.status === status);
    }

    return filteredAudits.slice((page - 1) * 20, page * 20);
  }

  async countMany(status?: AuditStatus): Promise<number> {
    let filteredAudits = this.audits;

    if (status) {
      filteredAudits = filteredAudits.filter((item) => item.status === status);
    }

    return filteredAudits.length;
  }

  async findManyByUserId(userId: string, page: number): Promise<Audit[]> {
    const audits = this.audits
      .filter((item) => item.user_id == userId)
      .slice((page - 1) * 20, page * 20);

    return audits;
  }

  async countManyByUserId(userId: string): Promise<number> {
    const audits = this.audits.filter((item) => item.user_id == userId);

    return audits.length;
  }

  async findPendingByUserId(userId: string): Promise<Audit | null> {
    const audit = this.audits.find(
      (item) => item.user_id == userId && item.status == "PENDING",
    );

    if (!audit) return null;

    return audit;
  }

  async findByAgentAndMerchantOnDate(
    userId: string,
    merchantId: string,
    date: Date,
  ): Promise<Audit | null> {
    const audit = this.audits.find((item) => {
      const isSameUser = item.user_id == userId;
      const isSameMerchant = item.merchant_id == merchantId;
      const isSameDate = dayjs(item.check_in_at).isSame(dayjs(date), "date");

      return isSameUser && isSameMerchant && isSameDate;
    });

    if (!audit) return null;

    return audit;
  }
}
