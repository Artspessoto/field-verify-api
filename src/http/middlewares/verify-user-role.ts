import { Role } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

export function verifyUserRole(roleToAuthenticate: Role) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user;

    if (role !== roleToAuthenticate) {
      return reply.status(401).send({ message: "Unauthorized" });
    }
  };
}
