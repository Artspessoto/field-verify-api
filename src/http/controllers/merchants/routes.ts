import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { verifyUserRole } from "../../middlewares/verify-user-role";
import { register } from "./register";

export async function merchantsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/merchants", { onRequest: [verifyUserRole("ADMIN")] }, register);
}
