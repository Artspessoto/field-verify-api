import { FastifyReply, FastifyRequest } from "fastify";
import { UserMapper } from "~/mappers/user-mapper";
import { updateProfileSchema } from "~/schemas/user.schema";
import { makeUpdateUserProfileUseCase } from "~/use-cases/factories/make-update-user-profile.use-case";

export async function updateProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, name } = updateProfileSchema.parse(request.body);
  const updateProfile = makeUpdateUserProfileUseCase();

  const { user } = await updateProfile.execute({
    userId: request.user.sub,
    email,
    name,
  });

  return reply.status(204).send({
    user: UserMapper.toHTTP(user),
  });
}
