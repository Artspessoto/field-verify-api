import { User } from "@prisma/client";
import { IUsersRepository } from "~/repositories/users-repository";
import { ResourceNotFoundError } from "../../errors/resource-not-found-error";
import { UserAlreadyExistsError } from "../../errors/user-already-exists-error";

export interface IUpdateUserProfileUseCaseReq {
  userId: string;
  name?: string;
  email?: string;
}

export class UpdateUserProfileUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    userId,
    name,
    email,
  }: IUpdateUserProfileUseCaseReq): Promise<{ user: User }> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw new ResourceNotFoundError();

    if (name) user.name = name;

    if (email && email !== user.email) {
      const userWithSameEmail = await this.usersRepository.findByEmail(email);
      if (userWithSameEmail) throw new UserAlreadyExistsError();
      user.email = email;
    }

    await this.usersRepository.save(user);
    return { user };
  }
}
