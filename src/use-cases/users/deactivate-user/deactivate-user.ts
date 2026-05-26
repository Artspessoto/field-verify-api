import { User } from "@prisma/client";
import { IUsersRepository } from "~/repositories/users-repository";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";

export interface IDeactivateUserUseCaseReq {
  userId: string;
}

export class DeactivateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    userId,
  }: IDeactivateUserUseCaseReq): Promise<{ user: User }> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw new ResourceNotFoundError();

    user.is_active = false;

    const updatedUser = await this.usersRepository.save(user);

    return { user: updatedUser };
  }
}
