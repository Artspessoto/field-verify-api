import { Role, User } from "@prisma/client";
import { IUsersRepository } from "~/repositories/users-repository";

export interface IGetAllUsersUseCaseReq {
  query: string;
  page: number;
  role?: Role;
  isActive?: boolean;
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
    isActive,
  }: IGetAllUsersUseCaseReq): Promise<IGetAllUsersUseCaseRes> {
    const [users, totalCount] = await Promise.all([
      this.usersRepository.findMany(query, page, role, isActive),
      this.usersRepository.countMany(query, role, isActive),
    ]);

    return { users, totalCount };
  }
}
