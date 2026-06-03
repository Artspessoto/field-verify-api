import { FastifyReply, FastifyRequest } from "fastify";
import {
  auditParamsSchema,
  overrideAuditBodySchema,
} from "~/schemas/audit.schema";
import { makeOverrideAuditsUseCase } from "~/use-cases/factories/audits/make-override-audit-use-case";

export async function override(request: FastifyRequest, reply: FastifyReply) {
  const { audit_id } = auditParamsSchema.parse(request.params);
  const { new_status, justification } = overrideAuditBodySchema.parse(
    request.body,
  );
  const overrideAudit = makeOverrideAuditsUseCase();

  const { audit } = await overrideAudit.execute({
    auditId: audit_id,
    justification,
    newStatus: new_status,
    supervisorId: request.user.sub,
  });

  return reply.status(200).send({ audit });
}
