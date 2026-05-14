import fastify from "fastify";
import { env } from "./env";
import { errorHandler } from "./http/error-handler";
import { usersRoutes } from "./http/controllers/routes";

export const app = fastify({
  logger: {
    transport: env.NODE_ENV == "dev" ? { target: "pino-pretty" } : undefined,
  },
});

app.register(usersRoutes);

app.setErrorHandler(errorHandler);
