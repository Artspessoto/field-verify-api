import { FastifyReply, FastifyRequest } from "fastify";
import { UserParamsSchema } from "~/schemas/user.schema";
import { makeDeactivateUserUseCase } from "~/use-cases/factories/users/make-deactivate-user-use-case";

export async function deactivate(
  request: FastifyRequest<{ Params: UserParamsSchema }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  const deactivateUseCase = makeDeactivateUserUseCase();

  await deactivateUseCase.execute({ userId: id });

  return reply.status(204).send(); //no content
}
