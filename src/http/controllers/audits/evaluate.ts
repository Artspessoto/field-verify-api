import { FastifyReply, FastifyRequest } from "fastify";
import {
  AuditParamsSchema,
  EvaluateAuditBodySchema,
} from "~/schemas/audit.schema";
import { makeEvaluateAuditUseCase } from "~/use-cases/factories/audits/make-evaluate-audit-use-case";

export async function evaluate(
  request: FastifyRequest<{
    Params: AuditParamsSchema;
    Body: EvaluateAuditBodySchema;
  }>,
  reply: FastifyReply,
) {
  const { audit_id } = request.params;
  const { status, supervisor_review } = request.body;

  const evaluateAudit = makeEvaluateAuditUseCase();

  const { audit } = await evaluateAudit.execute({
    auditId: audit_id,
    status,
    supervisorId: request.user.sub,
    supervisorReview: supervisor_review,
  });

  return reply.status(200).send({ audit });
}
