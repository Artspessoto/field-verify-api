import { PrismaUsersRepository } from "~/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "../users/authenticate";

export function makeAuthenticateUseCase(): AuthenticateUseCase {
  const userRepository = new PrismaUsersRepository();
  const useCase = new AuthenticateUseCase(userRepository);

  return useCase;
}
