import { Audit } from "@prisma/client";
import { IAuditsRepository } from "~/repositories/audits-repository";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";

export interface IGetAuditDetailsUseCaseReq {
  auditId: string;
}

export class GetAuditDetailsUseCase {
  constructor(private auditsRepository: IAuditsRepository) {}

  async execute({
    auditId,
  }: IGetAuditDetailsUseCaseReq): Promise<{ audit: Audit }> {
    const audit = await this.auditsRepository.findById(auditId);

    if (!audit) throw new ResourceNotFoundError();

    return { audit };
  }
}
