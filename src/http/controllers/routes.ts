import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { seach } from "./search";
import { verifyJWT } from "../middlewares/verify-jwt";
import { verifyUserRole } from "../middlewares/verify-user-role";
import { updateProfile } from "./update-profile";
import { changePassword } from "./change-password";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  app.register(async (privateRoutes) => {
    privateRoutes.addHook("onRequest", verifyJWT);

    privateRoutes.get("/profile", profile);
    privateRoutes.get(
      "/users/list",
      { onRequest: verifyUserRole("ADMIN") },
      seach,
    );

    privateRoutes.patch("/profile", updateProfile);
    privateRoutes.patch("/profile/password", changePassword);
  });
}
