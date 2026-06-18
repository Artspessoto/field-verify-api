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
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyHelmet from "@fastify/helmet";
import fastifyCors from "@fastify/cors";
import { auditsRoutes } from "./http/controllers/audits/routes";

export const app = fastify({
  logger: {
    transport: env.NODE_ENV == "dev" ? { target: "pino-pretty" } : undefined,
  },
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyHelmet); //header protection

app.register(fastifyCors, {
  origin: true,
  credentials: true,
});

app.register(fastifyRateLimit, {
  max: 100, //request limit
  timeWindow: "1 minute",
});

app.register(authPlugin);
app.register(swaggerPlugin);

app.register(usersRoutes);
app.register(merchantsRoutes);
app.register(auditsRoutes);

app.setErrorHandler(errorHandler);
