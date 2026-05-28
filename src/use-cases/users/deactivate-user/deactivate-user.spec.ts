import { expect, describe, it, beforeEach } from "vitest";
import { DeactivateUserUseCase } from "./deactivate-user";
import { InMemoryUsersRepository } from "~/repositories/in-memory/in-memory-users-repository";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let system: DeactivateUserUseCase;

describe("Deactivate User Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    system = new DeactivateUserUseCase(usersRepository);
  });

  it("should be able to deactivate a user", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      document: "123.456.789-00",
      password_hash: "mocked-hash-password",
      is_active: true,
    });

    const { user } = await system.execute({
      userId: createdUser.id,
    });

    const userInRepository = await usersRepository.findById(createdUser.id);

    expect(user.is_active).toBe(false);
    expect(userInRepository?.is_active).toBe(false);
  });

  it("should not be able to deactivate a non-existing user", async () => {
    await expect(() =>
      system.execute({
        userId: "non-existing-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
