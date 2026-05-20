import { PrismaUsersRepository } from "~/repositories/prisma/prisma-users-repository";
import { UpdateUserProfileUseCase } from "../../users/update-user-profile/update-user-profile";

export function makeUpdateUserProfileUseCase() {
  const userRepository = new PrismaUsersRepository();
  const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);

  return updateUserProfileUseCase;
}
