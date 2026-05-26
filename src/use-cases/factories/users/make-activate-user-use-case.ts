import { PrismaUsersRepository } from "~/repositories/prisma/prisma-users-repository";
import { ActivateUserUseCase } from "~/use-cases/users/activate-user/activate-user";

export function makeActivateUser() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new ActivateUserUseCase(usersRepository);

  return useCase;
}
