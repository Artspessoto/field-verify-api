import { FastifyReply, FastifyRequest } from "fastify";
import { searchMerchantSchema } from "~/schemas/merchant.schema";
import { makeGetAllMerchantsUseCase } from "~/use-cases/factories/merchants/make-get-all-merchants-use-case";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const { page, isActive, query } = searchMerchantSchema.parse(request.query);
  const getAllMerchants = makeGetAllMerchantsUseCase();

  const { merchants, totalCount } = await getAllMerchants.execute({
    query,
    page,
    isActive,
  });

  return reply.status(200).send({
    merchants,
    totalCount,
  });
}
