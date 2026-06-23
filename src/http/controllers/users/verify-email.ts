import { FastifyReply, FastifyRequest } from "fastify";
import { VerifyEmailSchema } from "~/schemas/user.schema";
import { makeVerifyEmailUseCase } from "~/use-cases/factories/users/make-verify-email-use-case";

export async function verifyEmail(
  request: FastifyRequest<{ Body: VerifyEmailSchema }>,
  reply: FastifyReply,
) {
  const { token } = request.body;
  const verifyEmailUseCase = makeVerifyEmailUseCase();

  await verifyEmailUseCase.execute({ tokenString: token });

  return reply.status(204).send();
}
