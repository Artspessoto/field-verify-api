import { IUsersRepository } from "~/repositories/users-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { compare, hash } from "bcrypt";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";

export interface IUpdateUserPasswordUseCaseReq {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export class UpdateUserPasswordUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    userId,
    oldPassword,
    newPassword,
  }: IUpdateUserPasswordUseCaseReq): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw new ResourceNotFoundError();

    const isOldPasswordMatches = await compare(oldPassword, user.password_hash);

    if (!isOldPasswordMatches) throw new InvalidCredentialsError();

    user.password_hash = await hash(newPassword, 6);

    await this.usersRepository.save(user);
  }
}
