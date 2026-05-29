import { FastifyReply, FastifyRequest } from "fastify";
import { UserMapper } from "~/mappers/user-mapper";
import { UpdateProfileSchema } from "~/schemas/user.schema";
import { makeUpdateUserProfileUseCase } from "~/use-cases/factories/users/make-update-user-profile.use-case";

export async function updateProfile(
  request: FastifyRequest<{ Body: UpdateProfileSchema }>,
  reply: FastifyReply,
) {
  const { email, name, document } = request.body;
  const updateProfile = makeUpdateUserProfileUseCase();

  const { user } = await updateProfile.execute({
    userId: request.user.sub,
    email,
    name,
    document,
  });

  return reply.status(200).send({
    user: UserMapper.toHTTP(user),
  });
}
