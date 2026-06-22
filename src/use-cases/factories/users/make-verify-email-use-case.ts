import { PrismaTokensRepository } from "~/repositories/prisma/prisma-tokens-repository";
import { PrismaUsersRepository } from "~/repositories/prisma/prisma-users-repository";
import { VerifyEmailUseCase } from "~/use-cases/tokens/verify-email/verify-email";

export function makeVerifyEmailUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const tokensRepository = new PrismaTokensRepository();
  const verifyEmailUseCase = new VerifyEmailUseCase(
    usersRepository,
    tokensRepository,
  );

  return verifyEmailUseCase;
}
