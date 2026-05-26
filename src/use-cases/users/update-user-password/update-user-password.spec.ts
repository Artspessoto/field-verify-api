import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "~/repositories/in-memory/in-memory-users-repository";
import { ResourceNotFoundError } from "../../errors/resource-not-found-error";
import { InvalidCredentialsError } from "../../errors/invalid-credentials-error";
import { hash, compare } from "bcrypt";
import { UpdateUserPasswordUseCase } from "./update-user-password";

let usersRepository: InMemoryUsersRepository;
let sut: UpdateUserPasswordUseCase;

describe("Update User Password Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new UpdateUserPasswordUseCase(usersRepository);
  });

  it("should be able to update user password", async () => {
    const createdUser = await usersRepository.create({
      name: "Arthur Spessoto",
      email: "arthur@example.com",
      document: "037.861.180-19",
      password_hash: await hash("old-password", 6),
    });

    await sut.execute({
      userId: createdUser.id,
      oldPassword: "old-password",
      newPassword: "new-password",
    });

    const updatedUser = await usersRepository.findById(createdUser.id);

    expect(updatedUser).toBeTruthy();

    const isOldPasswordStillValid = await compare(
      "old-password",
      updatedUser!.password_hash,
    );
    const isNewPasswordValid = await compare(
      "new-password",
      updatedUser!.password_hash,
    );

    expect(isOldPasswordStillValid).toBe(false);
    expect(isNewPasswordValid).toBe(true);
  });

  it("should not be able to update password of a non-existing user", async () => {
    await expect(() =>
      sut.execute({
        userId: "non-existing-id",
        oldPassword: "any-password",
        newPassword: "new-password",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update password with an incorrect old password", async () => {
    const createdUser = await usersRepository.create({
      name: "Arthur Spessoto",
      email: "arthur@example.com",
      document: "037.861.180-19",
      password_hash: await hash("correct-password", 6),
    });

    await expect(() =>
      sut.execute({
        userId: createdUser.id,
        oldPassword: "wrong-password",
        newPassword: "new-password",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);

    const userInDb = await usersRepository.findById(createdUser.id);
    const isPasswordUntouched = await compare(
      "correct-password",
      userInDb!.password_hash,
    );
    expect(isPasswordUntouched).toBe(true);
  });
});
