import { FastifyReply, FastifyRequest } from "fastify";
import { merchantSchema } from "~/schemas/merchant.schema";
import { makeRegisterMerchantUseCase } from "~/use-cases/factories/merchants/make-register-merchant-use-case";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, address, latitude, longitude, tax_identification } =
    merchantSchema.parse(request.body);

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
