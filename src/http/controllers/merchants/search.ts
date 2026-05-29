import { FastifyReply, FastifyRequest } from "fastify";
import { SearchMerchantSchema } from "~/schemas/merchant.schema";
import { makeGetAllMerchantsUseCase } from "~/use-cases/factories/merchants/make-get-all-merchants-use-case";

export async function search(
  request: FastifyRequest<{ Querystring: SearchMerchantSchema }>,
  reply: FastifyReply,
) {
  const { page, is_active, query } = request.query;
  const getAllMerchants = makeGetAllMerchantsUseCase();

  const { merchants, totalCount } = await getAllMerchants.execute({
    query,
    page,
    isActive: is_active,
  });

  return reply.status(200).send({
    merchants,
    totalCount,
  });
}
