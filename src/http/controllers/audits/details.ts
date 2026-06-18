import { FastifyReply, FastifyRequest } from "fastify";
import { AuditParamsSchema } from "~/schemas/audit.schema";
import { makeGetAuditDetailsUseCase } from "~/use-cases/factories/audits/make-get-audit-details-use-case";

export async function details(
  request: FastifyRequest<{ Params: AuditParamsSchema }>,
  reply: FastifyReply,
) {
  const getAuditDetails = makeGetAuditDetailsUseCase();
  const { audit_id } = request.params;

  const { audit } = await getAuditDetails.execute({
    auditId: audit_id,
    userId: request.user.sub,
    userRole: request.user.role,
  });

  return reply.status(200).send({ audit });
}
