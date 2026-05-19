import { hash } from "bcrypt";
import { IUsersRepository } from "~/repositories/users-repository";
import { UserAlreadyExistsError } from "../../errors/user-already-exists-error";
import { User } from "@prisma/client";

export interface IRegisterUseCaseReq {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ name, email, password }: IRegisterUseCaseReq): Promise<{
    user: User;
  }> {
    const userWithExistsEmail = await this.usersRepository.findByEmail(email);

    if (userWithExistsEmail) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 6);

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    //TODO: improve use case

    return { user };
  }
}
