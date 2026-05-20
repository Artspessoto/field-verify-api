import { PrismaUsersRepository } from "~/repositories/prisma/prisma-users-repository";
import { GetAllUsersUseCase } from "../../users/get-all-users/get-all-users";

export function makeGetAllUsersUseCase(): GetAllUsersUseCase {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new GetAllUsersUseCase(usersRepository);

  return useCase;
}
