import { FastifyReply, FastifyRequest } from "fastify";
import { UserParamsSchema } from "~/schemas/user.schema";
import { makeActivateUser } from "~/use-cases/factories/users/make-activate-user-use-case";

export async function activate(
  request: FastifyRequest<{ Params: UserParamsSchema }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  const activateUser = makeActivateUser();

  await activateUser.execute({ userId: id });

  return reply.status(204).send();
}
