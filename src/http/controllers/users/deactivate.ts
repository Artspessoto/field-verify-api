import { FastifyReply, FastifyRequest } from "fastify";
import { userParamsSchema } from "~/schemas/user.schema";
import { makeDeactivateUserUseCase } from "~/use-cases/factories/users/make-deactivate-user-use-case";

export async function deactivate(request: FastifyRequest, reply: FastifyReply) {
  const { id } = userParamsSchema.parse(request.params);

  const deactivateUseCase = makeDeactivateUserUseCase();

  await deactivateUseCase.execute({ userId: id });

  return reply.status(204).send(); //no content
}
