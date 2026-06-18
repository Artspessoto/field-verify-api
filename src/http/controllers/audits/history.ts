import { FastifyRequest, FastifyReply } from "fastify";
import { AgentAuditsHistoryQuerySchema } from "~/schemas/audit.schema";
import { makeFetchAgentsAuditsUseCase } from "~/use-cases/factories/audits/make-fetch-agent-audits-use-case";

export async function history(
  request: FastifyRequest<{ Querystring: AgentAuditsHistoryQuerySchema }>,
  reply: FastifyReply,
) {
  const { page } = request.query;
  const fetchAgentAuditsHistory = makeFetchAgentsAuditsUseCase();
  const { audits, totalCount } = await fetchAgentAuditsHistory.execute({
    userId: request.user.sub,
    page,
  });

  return reply.status(200).send({
    audits,
    totalCount,
  });
}
