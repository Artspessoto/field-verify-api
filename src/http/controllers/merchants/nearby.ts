import { FastifyReply, FastifyRequest } from "fastify";
import { nearbyMerchantsSchema } from "~/schemas/merchant.schema";
import { makeFetchNearbyMerchants } from "~/use-cases/factories/merchants/make-fetch-nearby-merchants-use-case";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const { latitude, longitude } = nearbyMerchantsSchema.parse(request.query);

  const fetchNearbyMerchants = makeFetchNearbyMerchants();

  const { merchants } = await fetchNearbyMerchants.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send({ merchants });
}
