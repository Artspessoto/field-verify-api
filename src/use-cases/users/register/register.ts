import { hash } from "bcrypt";
import { IUsersRepository } from "~/repositories/users-repository";
import { UserAlreadyExistsError } from "../../errors/user-already-exists-error";
import { User } from "@prisma/client";
import { encrypt } from "~/utils/crypto";
import { DocumentAlreadyInUseError } from "~/use-cases/errors/document-already-in-use-error";
import { ITokensRepository } from "~/repositories/tokens-repository";
import dayjs from "dayjs";
import { env } from "~/env";
import { IMailProvider } from "~/providers/mail-provider";

export interface IRegisterUseCaseReq {
  name: string;
  email: string;
  document: string;
  password: string;
}

export class RegisterUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private tokensRepository: ITokensRepository,
    private mailProvider: IMailProvider,
  ) {}

  async execute({
    name,
    email,
    document,
    password,
  }: IRegisterUseCaseReq): Promise<{
    user: User;
  }> {
    const userWithExistsEmail = await this.usersRepository.findByEmail(email);
    if (userWithExistsEmail) throw new UserAlreadyExistsError();

    const cleanDocument = document.replace(/\D/g, "");
    const encryptedDocument = encrypt(cleanDocument);

    const userWithExistsDocument =
      await this.usersRepository.findByDocument(encryptedDocument);
    if (userWithExistsDocument) throw new DocumentAlreadyInUseError();

    const password_hash = await hash(password, 6);

    const user = await this.usersRepository.create({
      name,
      document: encryptedDocument,
      email,
      password_hash,
    });

    const expiresIn = dayjs().add(24, "hours").toDate();
    const token = await this.tokensRepository.create({
      user_id: user.id,
      type: "EMAIL_VERIFICATION",
      expires_at: expiresIn,
    });

    const verifyLink = `${env.APP_WEB_URL}/verify-email?token=${token.token}`;

    await this.mailProvider.sendMail({
      to: user.email,
      subject: "[FieldVerify] Welcome! Verify your email",
      body: `
       <div style="font-family: sans-serif; font-size: 16px; color: #111;">
        <h1>Hello, ${user.name}!</h1>
        <p>Your FieldVerify account has been successfully created.</p>
        <p>To start performing audits, you need to confirm this email by clicking the link below:</p>
        <p><a href="${verifyLink}">Verify my email</a></p>
        <p>This link expires in 24 hours. If you didn't create this account, you can safely ignore this email.</p>
      </div>
      `,
    });

    return { user };
  }
}
