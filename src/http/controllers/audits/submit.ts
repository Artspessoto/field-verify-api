import { FastifyReply, FastifyRequest } from "fastify";
import { auditParamsSchema, submitAuditSchema } from "~/schemas/audit.schema";
import { makeSubmitAuditUseCase } from "~/use-cases/factories/audits/make-submit-audit-use-case";

export async function submit(request: FastifyRequest, reply: FastifyReply) {
  const { audit_id } = auditParamsSchema.parse(request.params);
  const { photos, notes, latitude, longitude } = submitAuditSchema.parse(
    request.body,
  );

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
