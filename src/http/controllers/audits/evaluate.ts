import { FastifyReply, FastifyRequest } from "fastify";
import {
  auditParamsSchema,
  evaluateAuditBodySchema,
} from "~/schemas/audit.schema";
import { makeEvaluateAuditUseCase } from "~/use-cases/factories/audits/make-evaluate-audit-use-case";

export async function evaluate(request: FastifyRequest, reply: FastifyReply) {
  const { audit_id } = auditParamsSchema.parse(request.params);
  const { status, supervisor_review } = evaluateAuditBodySchema.parse(
    request.body,
  );
  const evaluateAudit = makeEvaluateAuditUseCase();

  const { audit } = await evaluateAudit.execute({
    auditId: audit_id,
    status,
    supervisorId: request.user.sub,
    supervisorReview: supervisor_review,
  });

  return reply.status(200).send({ audit });
}
