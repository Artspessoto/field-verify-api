import { Audit } from "@prisma/client";
import { IAuditsRepository } from "~/repositories/audits-repository";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";
import { UnauthorizedAuditAccessError } from "~/use-cases/errors/unauthorized-audit-access-error";

export interface IGetAuditDetailsUseCaseReq {
  auditId: string;
  userId: string;
  userRole: "ADMIN" | "AGENT";
}

export class GetAuditDetailsUseCase {
  constructor(private auditsRepository: IAuditsRepository) {}

  async execute({
    auditId,
    userId,
    userRole,
  }: IGetAuditDetailsUseCaseReq): Promise<{ audit: Audit }> {
    const audit = await this.auditsRepository.findById(auditId);

    if (!audit) throw new ResourceNotFoundError();

    if (userRole == "AGENT" && audit.user_id !== userId)
      throw new UnauthorizedAuditAccessError();

    return { audit };
  }
}
