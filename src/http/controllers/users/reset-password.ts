import { FastifyReply, FastifyRequest } from "fastify";
import { ResetPasswordSchema } from "~/schemas/user.schema";
import { makeResetPasswordUseCase } from "~/use-cases/factories/users/make-reset-password-use-case";

export async function resetPassword(
  request: FastifyRequest<{ Body: ResetPasswordSchema }>,
  reply: FastifyReply,
) {
  const { token, password, confirmPassword: _ } = request.body;
  const resetPasswordUseCase = makeResetPasswordUseCase();

  await resetPasswordUseCase.execute({ tokenString: token, password });

  return reply.status(204).send();
}
