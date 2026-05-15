import { FastifyReply } from "fastify";
import { env } from "~/env";

export function setRefreshTokenCookie(
  reply: FastifyReply,
  refreshToken: string,
) {
  return reply.setCookie("refreshToken", refreshToken, {
    path: "/",
    secure: env.NODE_ENV === "production",
    sameSite: true,
    httpOnly: true,
  });
}
