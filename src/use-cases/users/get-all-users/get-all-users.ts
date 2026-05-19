import { Role, User } from "@prisma/client";
import { IUsersRepository } from "~/repositories/users-repository";

export interface IGetAllUsersUseCaseReq {
  query: string;
  page: number;
  role?: Role;
}

export interface IGetAllUsersUseCaseRes {
  users: User[];
  totalCount: number;
}

export class GetAllUsersUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    query,
    page,
    role,
  }: IGetAllUsersUseCaseReq): Promise<IGetAllUsersUseCaseRes> {
    const [users, totalCount] = await Promise.all([
      await this.usersRepository.findMany(query, page, role),
      await this.usersRepository.countMany(query, role),
    ]);

    return { users, totalCount };
  }
}
