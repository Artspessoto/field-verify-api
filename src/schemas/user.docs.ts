import { z } from "zod";
import {
  userSchema,
  userResponseSchema,
  updateProfileSchema,
  changePasswordSchema,
  userParamsSchema,
  searchSchema,
  sendPasswordResetSchema,
  verifyEmailSchema,
  resetPasswordSchema,
} from "./user.schema";
import { authenticateSchema } from "./authenticate.schema";

const security = [{ bearerAuth: [] }];

export const registerDoc = {
  tags: ["Users"],
  summary: "Register a new user (agent)",
  body: userSchema,
  response: {
    201: z.null(),
  },
};

export const authenticateDoc = {
  tags: ["Sessions"],
  summary: "Authenticate a user (agent or admin)",
  body: authenticateSchema,
  response: {
    200: z.object({ token: z.string() }),
  },
};

export const searchDoc = {
  tags: ["Users"],
  summary: "List all users (Admin only)",
  security,
  querystring: searchSchema,
  response: {
    200: z.object({
      users: z.array(userResponseSchema),
      totalCount: z.number(),
    }),
  },
};

export const profileDoc = {
  tags: ["Users"],
  summary: "Get authenticated user profile",
  security,
  response: {
    200: z.object({ user: userResponseSchema }),
  },
};

export const updateProfileDoc = {
  tags: ["Users"],
  summary: "Update user profile",
  security,
  body: updateProfileSchema,
  response: {
    200: z.object({ user: userResponseSchema }),
  },
};

export const changePasswordDoc = {
  tags: ["Users"],
  summary: "Change user password",
  security,
  body: changePasswordSchema,
  response: {
    204: z.null(),
  },
};

export const deactivateDoc = {
  tags: ["Users"],
  summary: "Deactivate a user (Admin only)",
  security,
  params: userParamsSchema,
  response: {
    204: z.null(),
  },
};

export const activateDoc = {
  tags: ["Users"],
  summary: "Activate a user (Admin only)",
  security,
  params: userParamsSchema,
  response: {
    204: z.null(),
  },
};

export const sendPasswordResetDoc = {
  tags: ["Users"],
  summary: "Forgot password (send token to user email)",
  body: sendPasswordResetSchema,
  response: {
    204: z.null(),
  },
};

export const verifyEmailDoc = {
  tags: ["Users"],
  summary: "Verify user email via token",
  body: verifyEmailSchema,
  response: {
    204: z.null(),
  },
};

export const resetPasswordDoc = {
  tags: ["Users"],
  summary: "Reset user password using token",
  body: resetPasswordSchema,
  response: {
    204: z.null(),
  },
};
