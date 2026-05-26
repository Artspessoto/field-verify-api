import { PrismaUsersRepository } from "~/repositories/prisma/prisma-users-repository";
import { DeactivateUserUseCase } from "~/use-cases/users/deactivate-user/deactivate-user";

export function makeDeactivateUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new DeactivateUserUseCase(usersRepository);

  return useCase;
}
