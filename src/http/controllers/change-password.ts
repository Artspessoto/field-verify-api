import { FastifyReply, FastifyRequest } from "fastify";
import { changePasswordSchema } from "~/schemas/user.schema";
import { makeUpdateUserPasswordUseCase } from "~/use-cases/factories/make-update-user-password-use-case";

export async function changePassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const {
    oldPassword,
    newPassword,
    confirmPassword: _,
  } = changePasswordSchema.parse(request.body);
  const updateUserPassword = makeUpdateUserPasswordUseCase();

  await updateUserPassword.execute({
    userId: request.user.sub,
    oldPassword,
    newPassword,
  });

  return reply.status(204).send();
}
