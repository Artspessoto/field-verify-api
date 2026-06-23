import { FastifyReply, FastifyRequest } from "fastify";
import { SendPasswordSchema } from "~/schemas/user.schema";
import { makeSendPasswordResetUseCase } from "~/use-cases/factories/users/make-send-password-reset-use-case";

export async function sendPasswordReset(
  request: FastifyRequest<{ Body: SendPasswordSchema }>,
  reply: FastifyReply,
) {
  const { email } = request.body;
  const sendPasswordResetUseCase = makeSendPasswordResetUseCase();

  await sendPasswordResetUseCase.execute({ email });

  return reply.status(204).send();
}
