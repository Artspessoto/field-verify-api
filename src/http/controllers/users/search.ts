import { FastifyReply, FastifyRequest } from "fastify";
import { UserMapper } from "~/mappers/user-mapper";
import { searchSchema } from "~/schemas/user.schema";
import { makeGetAllUsersUseCase } from "~/use-cases/factories/users/make-get-all-users";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const { query, page, role, is_active } = searchSchema.parse(request.query);
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
