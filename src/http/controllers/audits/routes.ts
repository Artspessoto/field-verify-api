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
import { uploadPhotos } from "./upload-photos";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  checkInDoc,
  detailsDoc,
  evaluateDoc,
  historyDoc,
  overrideDoc,
  searchDoc,
  submitDoc,
  uploadPhotosDoc,
} from "~/schemas/audit.docs";

export async function auditsRoutes(app: FastifyInstance) {
  const appWithZod = app.withTypeProvider<ZodTypeProvider>();

  appWithZod.addHook("onRequest", verifyJWT);

  const adminProvider = { onRequest: verifyUserRole("ADMIN") };

  //agent
  appWithZod.post(
    "/audits/check-in/:merchant_id",
    { schema: checkInDoc },
    checkIn,
  );
  appWithZod.patch("/audits/:audit_id/submit", { schema: submitDoc }, submit);
  appWithZod.get("/audits/history", { schema: historyDoc }, history);

  //agent and admin (can view own/assigned audits)
  appWithZod.get("/audits/:audit_id", { schema: detailsDoc }, details);
  appWithZod.post(
    "/audits/:audit_id/upload-url",
    { schema: uploadPhotosDoc },
    uploadPhotos,
  );

  //admin
  appWithZod.get("/audits", { ...adminProvider, schema: searchDoc }, search);
  appWithZod.patch(
    "/audits/:audit_id/evaluate",
    { ...adminProvider, schema: evaluateDoc },
    evaluate,
  );
  appWithZod.patch(
    "/audits/:audit_id/override",
    { ...adminProvider, schema: overrideDoc },
    override,
  );
}
