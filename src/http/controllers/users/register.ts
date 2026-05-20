import { userSchema } from "~/schemas/user.schema";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeRegisterUseCase } from "~/use-cases/factories/users/make-register-use-case";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = userSchema.parse(request.body);

  const registerUseCase = makeRegisterUseCase();

  await registerUseCase.execute({
    name,
    email,
    password,
  });

  return reply.status(201).send();
}
