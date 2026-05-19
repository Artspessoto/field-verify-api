import { User } from "@prisma/client";
import { IUsersRepository } from "~/repositories/users-repository";
import { InvalidCredentialsError } from "../../errors/invalid-credentials-error";
import { compare } from "bcrypt";

export interface IAuthenticateUseCase {
  email: string;
  password: string;
}

export class AuthenticateUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: IAuthenticateUseCase): Promise<{ user: User }> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await compare(password, user.password_hash);

    if (!passwordMatches) throw new InvalidCredentialsError();

    return { user };
  }
}
