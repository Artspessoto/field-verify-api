import { FastifyReply, FastifyRequest } from "fastify";
import {
  merchantParamsSchema,
  updateMerchantSchema,
} from "~/schemas/merchant.schema";
import { makeUpdateMerchantUseCase } from "~/use-cases/factories/merchants/make-update-merchant-use-case";

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = merchantParamsSchema.parse(request.params);
  const { name, address, is_active, latitude, longitude } =
    updateMerchantSchema.parse(request.body);

  const updateMerchantInfo = makeUpdateMerchantUseCase();

  const { merchant } = await updateMerchantInfo.execute({
    id,
    name,
    address,
    isActive: is_active,
    latitude,
    longitude,
  });

  return reply.status(200).send(merchant);
}
