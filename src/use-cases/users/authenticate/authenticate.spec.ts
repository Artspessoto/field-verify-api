import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "~/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "../../errors/invalid-credentials-error";
import { hash } from "bcrypt";

let usersRepository: InMemoryUsersRepository;
let system: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    system = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
    await usersRepository.create({
      name: "Arthur Spessoto",
      document: "316.508.050-04",
      email: "arthur@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await system.execute({
      email: "arthur@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.email).toEqual("arthur@example.com");
  });

  it("should not be able to authenticate with wrong email", async () => {
    await expect(() =>
      system.execute({
        email: "wrong@example.com",
        password: "any-password",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "Arthur Spessoto",
      email: "arthur@example.com",
      document: "316.508.050-04",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      system.execute({
        email: "arthur@example.com",
        password: "wrong-password",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
