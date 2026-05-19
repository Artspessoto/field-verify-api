import { PrismaUsersRepository } from "~/repositories/prisma/prisma-users-repository";
import { UpdateUserPasswordUseCase } from "../users/update-user-password/update-user-password";

export function makeUpdateUserPasswordUseCase() {
  const userRepository = new PrismaUsersRepository();
  const updateUserPasswordUseCase = new UpdateUserPasswordUseCase(
    userRepository,
  );

  return updateUserPasswordUseCase;
}
