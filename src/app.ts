import fastify from "fastify";
import { env } from "./env";
import { errorHandler } from "./http/error-handler";
import { usersRoutes } from "./http/controllers/users/routes";
import { authPlugin } from "./lib/auth-plugin";
import { merchantsRoutes } from "./http/controllers/merchants/routes";
import { swaggerPlugin } from "./lib/swagger-plugin";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

export const app = fastify({
  logger: {
    transport: env.NODE_ENV == "dev" ? { target: "pino-pretty" } : undefined,
  },
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(authPlugin);
app.register(swaggerPlugin);

app.register(usersRoutes);
app.register(merchantsRoutes);

app.setErrorHandler(errorHandler);
