import { FastifyInstance } from "fastify";
import { verifyJWT } from "~/http/middlewares/verify-jwt";
import { checkIn } from "./check-in";
import { submit } from "./submit";
import { verifyUserRole } from "~/http/middlewares/verify-user-role";
import { search } from "./search";
import { evaluate } from "./evaluate";
import { override } from "./override";
import { details } from "./details";
import { history } from "./history";

export async function auditsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  const adminProvider = { onRequest: verifyUserRole("ADMIN") };

  //agent
  app.post("/audits/check-in/:merchant_id", checkIn);
  app.patch("/audits/:audit_id/submit", submit);
  app.get("/audits/history", history);

  //agent and admin (can view own/assigned audits)
  app.get("/audits/:audit_id", details);

  //admin
  app.get("/audits", adminProvider, search);
  app.patch("/audits/:audit_id/evaluate", adminProvider, evaluate);
  app.patch("/audits/:audit_id/override", adminProvider, override);
}
