import { FastifyReply, FastifyRequest } from "fastify";
import {
  AuditParamsSchema,
  OverrideAuditBodySchema,
} from "~/schemas/audit.schema";
import { makeOverrideAuditsUseCase } from "~/use-cases/factories/audits/make-override-audit-use-case";

export async function override(
  request: FastifyRequest<{
    Params: AuditParamsSchema;
    Body: OverrideAuditBodySchema;
  }>,
  reply: FastifyReply,
) {
  const { audit_id } = request.params;
  const { new_status, justification } = request.body;

  const overrideAudit = makeOverrideAuditsUseCase();

  const { audit } = await overrideAudit.execute({
    auditId: audit_id,
    justification,
    newStatus: new_status,
    supervisorId: request.user.sub,
  });

  return reply.status(200).send({ audit });
}
