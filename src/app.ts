import fastify from "fastify";
import { env } from "./env";
import { errorHandler } from "./http/error-handler";
import { usersRoutes } from "./http/controllers/users/routes";
import { authPlugin } from "./lib/auth-plugin";
import { merchantsRoutes } from "./http/controllers/merchants/routes";

export const app = fastify({
  logger: {
    transport: env.NODE_ENV == "dev" ? { target: "pino-pretty" } : undefined,
  },
});

app.register(authPlugin);

app.register(usersRoutes);
app.register(merchantsRoutes);

app.setErrorHandler(errorHandler);
