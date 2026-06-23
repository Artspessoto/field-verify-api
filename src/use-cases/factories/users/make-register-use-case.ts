import { PrismaUsersRepository } from "~/repositories/prisma/prisma-users-repository";
import { RegisterUseCase } from "../../users/register/register";
import { PrismaTokensRepository } from "~/repositories/prisma/prisma-tokens-repository";
import { NodemailerMailProvider } from "~/providers/mail/nodemailer-mail-provider";

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const tokensRepository = new PrismaTokensRepository();
  const mailProvider = new NodemailerMailProvider(); //env development

  const registerUseCase = new RegisterUseCase(
    usersRepository,
    tokensRepository,
    mailProvider,
  );

  return registerUseCase;
}
