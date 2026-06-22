import { PrismaTokensRepository } from "~/repositories/prisma/prisma-tokens-repository";
import { PrismaUsersRepository } from "~/repositories/prisma/prisma-users-repository";
import { ResetPasswordUseCase } from "~/use-cases/tokens/reset-password/reset-password";

export function makeResetPasswordUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const tokensRepository = new PrismaTokensRepository();
  const resetPasswordUseCase = new ResetPasswordUseCase(
    usersRepository,
    tokensRepository,
  );

  return resetPasswordUseCase;
}
