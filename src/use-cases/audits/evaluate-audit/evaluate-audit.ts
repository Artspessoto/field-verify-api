import { Audit } from "@prisma/client";
import { IAuditsRepository } from "~/repositories/audits-repository";
import { InvalidAuditStateError } from "~/use-cases/errors/invalid-audit-state-error";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";

export interface IEvaluateAuditCaseReq {
  supervisorId: string;
  auditId: string;
  status: "APPROVED" | "REJECTED" | "FRAUD_SUSPECT";
  supervisorReview?: string | null;
}

export class EvaluateAuditUseCase {
  constructor(private auditsRepository: IAuditsRepository) {}

  async execute({
    auditId,
    supervisorId,
    status,
    supervisorReview,
  }: IEvaluateAuditCaseReq): Promise<{ audit: Audit }> {
    const audit = await this.auditsRepository.findById(auditId);

    if (!audit) throw new ResourceNotFoundError();

    if (audit.status !== "IN_REVIEW") throw new InvalidAuditStateError();

    audit.status = status;
    audit.supervisor_id = supervisorId;
    audit.supervisor_review = supervisorReview ?? null;
    audit.validated_at = new Date();

    const reviewAudit = await this.auditsRepository.save(audit);

    return { audit: reviewAudit };
  }
}
