import { NodemailerMailProvider } from "~/providers/mail/nodemailer-mail-provider";
import { PrismaTokensRepository } from "~/repositories/prisma/prisma-tokens-repository";
import { PrismaUsersRepository } from "~/repositories/prisma/prisma-users-repository";
import { SendPasswordResetUseCase } from "~/use-cases/tokens/send-password-reset/send-password-reset";

export function makeSendPasswordResetUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const tokensRepository = new PrismaTokensRepository();
  const mailProvider = new NodemailerMailProvider();

  const sendPasswordReset = new SendPasswordResetUseCase(
    usersRepository,
    tokensRepository,
    mailProvider,
  );

  return sendPasswordReset;
}
