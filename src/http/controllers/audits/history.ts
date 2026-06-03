import { FastifyRequest, FastifyReply } from "fastify";
import { agentAuditsHistoryQuerySchema } from "~/schemas/audit.schema";
import { makeFetchAgentsAuditsUseCase } from "~/use-cases/factories/audits/make-fetch-agent-audits-use-case";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const { page } = agentAuditsHistoryQuerySchema.parse(request.query);
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
