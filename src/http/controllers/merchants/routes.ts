import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { verifyUserRole } from "../../middlewares/verify-user-role";
import { register } from "./register";
import { search } from "./search";
import { details } from "./details";
import { update } from "./update";
import { nearby } from "./nearby";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  merchantDetailsDoc,
  nearbyMerchantsDoc,
  registerMerchantDoc,
  searchMerchantsDoc,
  updateMerchantDoc,
} from "~/schemas/merchant.docs";

export async function merchantsRoutes(app: FastifyInstance) {
  const appWithZod = app.withTypeProvider<ZodTypeProvider>();

  appWithZod.addHook("onRequest", verifyJWT);

  const adminProvider = { onRequest: verifyUserRole("ADMIN") };

  //only admin
  appWithZod.post(
    "/merchants",
    { ...adminProvider, schema: registerMerchantDoc },
    register,
  );
  appWithZod.get(
    "/merchants",
    { ...adminProvider, schema: searchMerchantsDoc },
    search,
  );
  appWithZod.patch(
    "/merchants/:id",
    { ...adminProvider, schema: updateMerchantDoc },
    update,
  );

  //agent
  appWithZod.get("/merchants/:id", { schema: merchantDetailsDoc }, details);
  appWithZod.get("/merchants/nearby", { schema: nearbyMerchantsDoc }, nearby);
}
