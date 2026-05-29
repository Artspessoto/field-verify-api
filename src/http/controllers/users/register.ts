import { FastifyReply, FastifyRequest } from "fastify";
import { UserBodySchema } from "~/schemas/user.schema";
import { makeRegisterUseCase } from "~/use-cases/factories/users/make-register-use-case";

export async function register(
  request: FastifyRequest<{ Body: UserBodySchema }>,
  reply: FastifyReply,
) {
  const { name, email, document, password } = request.body;

  const registerUseCase = makeRegisterUseCase();

  await registerUseCase.execute({
    name,
    document,
    email,
    password,
  });

  return reply.status(201).send();
}
