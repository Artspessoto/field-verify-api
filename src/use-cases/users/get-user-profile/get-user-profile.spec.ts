import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "~/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "../../errors/resource-not-found-error";
import { hash } from "bcrypt";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to get user profile", async () => {
    const createdUser = await usersRepository.create({
      name: "Arthur Spessoto",
      email: "arthur@example.com",
      document: "037.861.180-19",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("Arthur Spessoto");
    expect(user.email).toEqual("arthur@example.com");
  });

  it("should not be able to get user profile with wrong id", async () => {
    await expect(() =>
      sut.execute({
        userId: "non-existing-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
