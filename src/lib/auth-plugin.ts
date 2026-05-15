import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fp from "fastify-plugin";
import { env } from "~/env";

export const authPlugin = fp(async (app) => {
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: "refreshToken",
      signed: false,
    },
    sign: {
      expiresIn: "20m",
    },
  });

  await app.register(fastifyCookie);
});
