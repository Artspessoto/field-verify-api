import { expect, describe, it, beforeEach } from "vitest";
import { ActivateUserUseCase } from "./activate-user";
import { InMemoryUsersRepository } from "~/repositories/in-memory/in-memory-users-repository";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let system: ActivateUserUseCase;

describe("Activate User Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    system = new ActivateUserUseCase(usersRepository);
  });

  it("should be able to activate a user", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      document: "123.456.789-00",
      password_hash: "mocked-hash-password",
      is_active: false,
    });

    const { user } = await system.execute({
      userId: createdUser.id,
    });

    const userInRepository = await usersRepository.findById(createdUser.id);

    expect(user.is_active).toBe(true);
    expect(userInRepository?.is_active).toBe(true);
  });

  it("should not be able to activate a non-existing user", async () => {
    await expect(() =>
      system.execute({
        userId: "non-existing-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
