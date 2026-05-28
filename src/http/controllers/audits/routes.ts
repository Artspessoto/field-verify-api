import { FastifyInstance } from "fastify";
import { verifyJWT } from "~/http/middlewares/verify-jwt";
import { checkIn } from "./check-in";
import { submit } from "./submit";

export async function auditsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/audits/check-in/:merchant_id", checkIn);
  app.patch("/audits/:audit_id/submit", submit);
}
