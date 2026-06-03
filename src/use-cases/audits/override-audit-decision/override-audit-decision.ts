import { Audit } from "@prisma/client";
import { IAuditsRepository } from "~/repositories/audits-repository";
import { AuditNotEvaluatedError } from "~/use-cases/errors/audit-not-evaluated-error";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";

export interface IOverrideAuditDecisionUseCaseReq {
  supervisorId: string;
  auditId: string;
  newStatus: "APPROVED" | "REJECTED" | "FRAUD_SUSPECT";
  justification: string;
}

export class OverrideAuditDecisionUseCase {
  constructor(private auditsRepository: IAuditsRepository) {}

  async execute({
    auditId,
    supervisorId,
    newStatus,
    justification,
  }: IOverrideAuditDecisionUseCaseReq): Promise<{ audit: Audit }> {
    const audit = await this.auditsRepository.findById(auditId);

    if (!audit) throw new ResourceNotFoundError();

    if (audit.status == "PENDING" || audit.status == "IN_REVIEW")
      throw new AuditNotEvaluatedError();

    audit.status = newStatus;
    audit.supervisor_id = supervisorId;
    audit.supervisor_review = justification;
    audit.validated_at = new Date();

    const updateAudit = await this.auditsRepository.save(audit);

    return { audit: updateAudit };
  }
}
