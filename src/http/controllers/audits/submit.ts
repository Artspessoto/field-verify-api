import { FastifyReply, FastifyRequest } from "fastify";
import {
  AuditParamsSchema,
  SubmitAuditBodySchema,
} from "~/schemas/audit.schema";
import { makeSubmitAuditUseCase } from "~/use-cases/factories/audits/make-submit-audit-use-case";

export async function submit(
  request: FastifyRequest<{
    Params: AuditParamsSchema;
    Body: SubmitAuditBodySchema;
  }>,
  reply: FastifyReply,
) {
  const { audit_id } = request.params;
  const { photos, notes, latitude, longitude } = request.body;

  const submitAudit = makeSubmitAuditUseCase();

  const { audit } = await submitAudit.execute({
    userId: request.user.sub,
    auditId: audit_id,
    photos,
    notes,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send({ audit });
}
