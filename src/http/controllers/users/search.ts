import { FastifyReply, FastifyRequest } from "fastify";
import { UserMapper } from "~/mappers/user-mapper";
import { SearchSchema } from "~/schemas/user.schema";
import { makeGetAllUsersUseCase } from "~/use-cases/factories/users/make-get-all-users";

export async function search(
  request: FastifyRequest<{ Querystring: SearchSchema }>,
  reply: FastifyReply,
) {
  const { query, page, role, is_active } = request.query;
  const getAllUsers = makeGetAllUsersUseCase();

  const { users, totalCount } = await getAllUsers.execute({
    query,
    page,
    role,
    isActive: is_active,
  });

  return reply.status(200).send({
    users: UserMapper.toHTTPList(users),
    totalCount,
  });
}
