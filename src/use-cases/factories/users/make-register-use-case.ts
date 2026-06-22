import { PrismaUsersRepository } from "~/repositories/prisma/prisma-users-repository";
import { RegisterUseCase } from "../../users/register/register";
import { PrismaTokensRepository } from "~/repositories/prisma/prisma-tokens-repository";

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const tokensRepository = new PrismaTokensRepository();
  const registerUseCase = new RegisterUseCase(
    usersRepository,
    tokensRepository,
  );

  return registerUseCase;
}
