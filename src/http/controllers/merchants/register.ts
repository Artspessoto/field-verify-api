import { FastifyReply, FastifyRequest } from "fastify";
import { MerchantSchema } from "~/schemas/merchant.schema";
import { makeRegisterMerchantUseCase } from "~/use-cases/factories/merchants/make-register-merchant-use-case";

export async function register(
  request: FastifyRequest<{ Body: MerchantSchema }>,
  reply: FastifyReply,
) {
  const { name, address, latitude, longitude, tax_identification } =
    request.body;

  const registerMerchantUseCase = makeRegisterMerchantUseCase();

  await registerMerchantUseCase.execute({
    name,
    address,
    latitude,
    longitude,
    tax_identification,
  });

  reply.status(201).send();
}
