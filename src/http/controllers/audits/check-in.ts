import { FastifyReply, FastifyRequest } from "fastify";
import {
  checkInSchemaParams,
  createCheckInBodySchema,
} from "~/schemas/audit.schema";
import { makeCheckInUseCase } from "~/use-cases/factories/audits/make-check-in-use-case";

export async function checkIn(request: FastifyRequest, reply: FastifyReply) {
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);
  const { merchant_id } = checkInSchemaParams.parse(request.params);
  const checkInAudit = makeCheckInUseCase();

  const { audit } = await checkInAudit.execute({
    merchantId: merchant_id,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send({ audit });
}
