import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "~/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { UpdateUserProfileUseCase } from "./update-user-profile";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";
import { UserAlreadyExistsError } from "~/use-cases/errors/user-already-exists-error";

let usersRepository: InMemoryUsersRepository;
let system: UpdateUserProfileUseCase;

describe("Update User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    system = new UpdateUserProfileUseCase(usersRepository);
  });

  it("should be able to update user profile name, email and document", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      document: "214.099.400-04", //cpf generator
      password_hash: await hash("12346", 6),
    });

    const { user } = await system.execute({
      userId: createdUser.id,
      name: "Arthur Spessoto",
      email: "arthur@example.com",
    });

    expect(user.name).toEqual("Arthur Spessoto");
    expect(user.email).toEqual("arthur@example.com");

    const updatedUserInDb = await usersRepository.findById(createdUser.id);
    expect(updatedUserInDb?.name).toEqual("Arthur Spessoto");
  });

  it("should be able to update only the name", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      document: "214.099.400-04", //cpf generator
      password_hash: await hash("123456", 6),
    });

    const { user } = await system.execute({
      userId: createdUser.id,
      name: "Only Name Changed",
    });

    expect(user.name).toEqual("Only Name Changed");
    expect(user.email).toEqual("johndoe@example.com");
  });

  it("should not be able to update profile of a non-existing user", async () => {
    await expect(() =>
      system.execute({
        userId: "non-existing-id",
        name: "Ghost User",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update to an email that is already taken", async () => {
    const user1 = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      document: "214.099.400-04", //cpf generator
      password_hash: await hash("123456", 6),
    });

    await usersRepository.create({
      name: "Alex Smith",
      email: "alex@example.com",
      document: "214.099.400-04", //cpf generator
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      system.execute({
        userId: user1.id,
        email: "alex@example.com",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
