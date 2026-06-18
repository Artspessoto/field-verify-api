import { FastifyReply, FastifyRequest } from "fastify";
import {
  CheckInSchemaParams,
  CreateCheckInBodySchema,
} from "~/schemas/audit.schema";
import { makeCheckInUseCase } from "~/use-cases/factories/audits/make-check-in-use-case";

export async function checkIn(
  request: FastifyRequest<{
    Body: CreateCheckInBodySchema;
    Params: CheckInSchemaParams;
  }>,
  reply: FastifyReply,
) {
  const { latitude, longitude } = request.body;
  const { merchant_id } = request.params;
  const checkInAudit = makeCheckInUseCase();

  const { audit } = await checkInAudit.execute({
    merchantId: merchant_id,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send({ audit });
}
