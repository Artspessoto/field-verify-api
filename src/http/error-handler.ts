import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { AppError } from "~/core/errors/app-error";
import { env } from "~/env";

export const errorHandler = (
  error: unknown,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const isDev = env.NODE_ENV == "dev" || env.NODE_ENV == "test";

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error.",
      issues: error.format(),
    });
  }

  if (error instanceof AppError) {
    request.log.warn({ code: error.code }, error.message);

    return reply.status(error.statusCode).send({
      status: "error",
      code: error.code,
      message: error.message,
    });
  }

  request.log.error(error);

  return reply.status(500).send({
    message: isDev
      ? error instanceof Error
        ? error.message
        : "Internal Server Error"
      : "An internal error occurred. Please try again later.",
  });
};
