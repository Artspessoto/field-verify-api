import { FastifyReply, FastifyRequest } from "fastify";
import { userParamsSchema } from "~/schemas/user.schema";
import { makeActivateUser } from "~/use-cases/factories/users/make-activate-user-use-case";

export async function activate(request: FastifyRequest, reply: FastifyReply) {
  const { id } = userParamsSchema.parse(request.params);

  const activateUser = makeActivateUser();

  await activateUser.execute({ userId: id });

  return reply.status(204).send();
}
