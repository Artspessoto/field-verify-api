import prisma from "~/lib/prisma";
import { userSchema } from "~/schemas/user.schema";
import { FastifyReply, FastifyRequest } from "fastify";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = userSchema.parse(request.body);

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password,
    },
  });

  return reply.status(201).send();
}
