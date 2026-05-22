import { FastifyReply, FastifyRequest } from "fastify";
import { merchantParamsSchema } from "~/schemas/merchant.schema";
import { makeGetMerchantUseCase } from "~/use-cases/factories/merchants/make-get-merchant-use-case";

export async function details(request: FastifyRequest, reply: FastifyReply) {
  const getMerchantDetails = makeGetMerchantUseCase();
  const { id } = merchantParamsSchema.parse(request.params);

  const { merchant } = await getMerchantDetails.execute({ merchantId: id });

  return reply.status(200).send(merchant);
}
