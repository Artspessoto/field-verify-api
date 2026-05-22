import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { verifyUserRole } from "../../middlewares/verify-user-role";
import { register } from "./register";
import { search } from "./search";
import { details } from "./details";
import { update } from "./update";

export async function merchantsRoutes(app: FastifyInstance) {
  const adminProvider = { onRequest: [verifyUserRole("ADMIN")] };
  app.addHook("onRequest", verifyJWT);

  app.post("/merchants", adminProvider, register);
  app.get("/merchants", adminProvider, search);
  app.patch("/merchants/:id", adminProvider, update);

  app.get("/merchants/:id", details);
}
