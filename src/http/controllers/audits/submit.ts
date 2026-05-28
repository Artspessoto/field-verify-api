import { FastifyReply, FastifyRequest } from "fastify";
import {
  submitAuditParamsSchema,
  submitAuditSchema,
} from "~/schemas/audit.schema";
import { makeSubmitAuditUseCase } from "~/use-cases/factories/audits/make-submit-audit-use-case";

export async function submit(request: FastifyRequest, reply: FastifyReply) {
  const { audit_id } = submitAuditParamsSchema.parse(request.params);
  const { photos, notes } = submitAuditSchema.parse(request.body);

  const submitAudit = makeSubmitAuditUseCase();

  const { audit } = await submitAudit.execute({
    userId: request.user.sub,
    auditId: audit_id,
    photos,
    notes,
  });

  return reply.status(201).send({ audit });
}
