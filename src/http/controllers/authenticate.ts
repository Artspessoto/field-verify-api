import { FastifyReply, FastifyRequest } from "fastify";
import { authenticateSchema } from "~/schemas/authenticate.schema";
import { makeAuthenticateUseCase } from "~/use-cases/factories/make-authenticate-use-case";
import { setRefreshTokenCookie } from "~/utils/cookie-utils";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = authenticateSchema.parse(request.body);

  const authenticateUseCase = makeAuthenticateUseCase();

  const { user } = await authenticateUseCase.execute({ email, password });

  const token = await reply.jwtSign(
    { role: user.role },
    { sign: { sub: user.id } },
  );

  const refreshToken = await reply.jwtSign(
    { role: user.role },
    { sign: { sub: user.id, expiresIn: "7d" } },
  );

  setRefreshTokenCookie(reply, refreshToken);
  return reply.status(200).send({ token });
}
