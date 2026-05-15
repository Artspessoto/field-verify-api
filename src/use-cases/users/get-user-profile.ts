import { User } from "@prisma/client";
import { IUsersRepository } from "~/repositories/users-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

export interface IGetUserProfileUseCaseReq {
  userId: string;
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ userId }: IGetUserProfileUseCaseReq): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw new ResourceNotFoundError();

    return user;
  }
}
