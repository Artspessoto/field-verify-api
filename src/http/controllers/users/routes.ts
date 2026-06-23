import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { search } from "./search";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { verifyUserRole } from "../../middlewares/verify-user-role";
import { updateProfile } from "./update-profile";
import { changePassword } from "./change-password";
import { deactivate } from "./deactivate";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  activateDoc,
  authenticateDoc,
  changePasswordDoc,
  deactivateDoc,
  profileDoc,
  registerDoc,
  resetPasswordDoc,
  searchDoc,
  sendPasswordResetDoc,
  updateProfileDoc,
  verifyEmailDoc,
} from "~/schemas/user.docs";
import { activate } from "./activate";
import { sendPasswordReset } from "./send-password-reset";
import { verifyEmail } from "./verify-email";
import { resetPassword } from "./reset-password";

export async function usersRoutes(app: FastifyInstance) {
  const appWithZod = app.withTypeProvider<ZodTypeProvider>();

  appWithZod.post("/users", { schema: registerDoc }, register);

  appWithZod.post("/sessions", { schema: authenticateDoc }, authenticate);

  appWithZod.post(
    "/users/password/forgot",
    { schema: sendPasswordResetDoc },
    sendPasswordReset,
  );

  appWithZod.patch(
    "/users/verify-email",
    { schema: verifyEmailDoc },
    verifyEmail,
  );

  appWithZod.patch(
    "/users/password/reset",
    { schema: resetPasswordDoc },
    resetPassword,
  );

  appWithZod.register(async (privateRoutes) => {
    const privateZodRoutes = privateRoutes.withTypeProvider<ZodTypeProvider>();

    const adminProvider = { onRequest: verifyUserRole("ADMIN") };
    privateZodRoutes.addHook("onRequest", verifyJWT);

    privateZodRoutes.get("/profile", { schema: profileDoc }, profile);
    privateZodRoutes.patch(
      "/profile",
      { schema: updateProfileDoc },
      updateProfile,
    );
    privateZodRoutes.patch(
      "/profile/password",
      { schema: changePasswordDoc },
      changePassword,
    );

    privateZodRoutes.get(
      "/users/list",
      { ...adminProvider, schema: searchDoc },
      search,
    );
    privateZodRoutes.patch(
      "/users/:id/deactivate",
      { ...adminProvider, schema: deactivateDoc },
      deactivate,
    );
    privateZodRoutes.patch(
      "/users/:id/activate",
      { ...adminProvider, schema: activateDoc },
      activate,
    );
  });
}
