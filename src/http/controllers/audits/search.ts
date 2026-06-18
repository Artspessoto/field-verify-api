import { FastifyReply, FastifyRequest } from "fastify";
import { SearchAuditsQuerySchema } from "~/schemas/audit.schema";
import { makeSearchAuditsUseCase } from "~/use-cases/factories/audits/make-search-audits-use-case";

export async function search(
  request: FastifyRequest<{ Querystring: SearchAuditsQuerySchema }>,
  reply: FastifyReply,
) {
  const { page, status } = request.query;
  const searchAudits = makeSearchAuditsUseCase();

  const { audits, totalCount } = await searchAudits.execute({
    page,
    status,
  });

  return reply.status(200).send({
    audits,
    totalCount,
  });
}
