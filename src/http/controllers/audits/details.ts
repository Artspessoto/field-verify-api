import { FastifyReply, FastifyRequest } from "fastify";
import { auditParamsSchema } from "~/schemas/audit.schema";
import { makeGetAuditDetailsUseCase } from "~/use-cases/factories/audits/make-get-audit-details-use-case";

export async function details(request: FastifyRequest, reply: FastifyReply) {
  const getAuditDetails = makeGetAuditDetailsUseCase();
  const { audit_id } = auditParamsSchema.parse(request.params);

  const { audit } = await getAuditDetails.execute({
    auditId: audit_id,
    userId: request.user.sub,
    userRole: request.user.role,
  });

  return reply.status(200).send({ audit });
}
