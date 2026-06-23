import { Token } from "@prisma/client";
import dayjs from "dayjs";
import { env } from "~/env";
import { IMailProvider } from "~/providers/mail-provider";
import { ITokensRepository } from "~/repositories/tokens-repository";
import { IUsersRepository } from "~/repositories/users-repository";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";

export interface ISendPasswordResetUseCaseReq {
  email: string; //recovery email
}

export class SendPasswordResetUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private tokensRepository: ITokensRepository,
    private mailProvider: IMailProvider,
  ) {}

  async execute({
    email,
  }: ISendPasswordResetUseCaseReq): Promise<{ token: Token }> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new ResourceNotFoundError();

    const expiresIn = dayjs().add(2, "hours").toDate();

    const token = await this.tokensRepository.create({
      user_id: user.id,
      type: "PASSWORD_RESET",
      expires_at: expiresIn,
    });

    const resetLink = `${env.APP_WEB_URL}/reset-password?token=${token.token}`;

    await this.mailProvider.sendMail({
      to: user.email,
      subject: "[FieldVerify] Password Reset",
      body: `
      <div style="font-family: sans-serif; font-size: 16px; color: #111;">
        h1>Hello, ${user.name}</h1>
        <p>You requested a password reset for FieldVerify.</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetLink}">Reset my password</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
      `,
    });

    return { token };
  }
}
