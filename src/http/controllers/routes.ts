import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { seach } from "./search";
import { verifyJWT } from "../middlewares/verify-jwt";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  app.get("/profile", { onRequest: [verifyJWT] }, profile);
  app.get("/users/list", seach);
}
