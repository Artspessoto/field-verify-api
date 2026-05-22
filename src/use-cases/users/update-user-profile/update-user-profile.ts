import { User } from "@prisma/client";
import { IUsersRepository } from "~/repositories/users-repository";
import { ResourceNotFoundError } from "../../errors/resource-not-found-error";
import { UserAlreadyExistsError } from "../../errors/user-already-exists-error";
import { encrypt } from "~/utils/crypto";
import { DocumentAlreadyInUseError } from "~/use-cases/errors/document-already-in-use-error";

export interface IUpdateUserProfileUseCaseReq {
  userId: string;
  name?: string;
  email?: string;
  document?: string;
}

export class UpdateUserProfileUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    userId,
    name,
    email,
    document,
  }: IUpdateUserProfileUseCaseReq): Promise<{ user: User }> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw new ResourceNotFoundError();

    if (name) user.name = name;

    if (email && email !== user.email) {
      const userWithSameEmail = await this.usersRepository.findByEmail(email);
      if (userWithSameEmail) throw new UserAlreadyExistsError();
      user.email = email;
    }

    if (document) {
      const cleanDocument = document.replace(/\D/g, "");
      const encryptedDocument = encrypt(cleanDocument);

      if (encryptedDocument !== user.document) {
        const userWithSameDocument =
          await this.usersRepository.findByDocument(encryptedDocument);

        if (userWithSameDocument) {
          throw new DocumentAlreadyInUseError();
        }

        user.document = encryptedDocument;
      }
    }

    const updatedUser = await this.usersRepository.save(user);

    return { user: updatedUser };
  }
}
