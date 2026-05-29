import { FastifyReply, FastifyRequest } from "fastify";
import { ChangePasswordSchema } from "~/schemas/user.schema";
import { makeUpdateUserPasswordUseCase } from "~/use-cases/factories/users/make-update-user-password-use-case";

export async function changePassword(
  request: FastifyRequest<{ Body: ChangePasswordSchema }>,
  reply: FastifyReply,
) {
  const { oldPassword, newPassword, confirmPassword: _ } = request.body;
  const updateUserPassword = makeUpdateUserPasswordUseCase();

  await updateUserPassword.execute({
    userId: request.user.sub,
    oldPassword,
    newPassword,
  });

  return reply.status(204).send();
}
