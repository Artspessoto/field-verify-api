import { hash } from "bcrypt";
import { IUsersRepository } from "~/repositories/users-repository";
import { UserAlreadyExistsError } from "../../errors/user-already-exists-error";
import { User } from "@prisma/client";
import { encrypt } from "~/utils/crypto";
import { DocumentAlreadyInUseError } from "~/use-cases/errors/document-already-in-use-error";
import { ITokensRepository } from "~/repositories/tokens-repository";
import dayjs from "dayjs";

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

    console.log(token);

    return { user };
  }
}
