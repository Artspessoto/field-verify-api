import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "~/repositories/in-memory/in-memory-users-repository";
import { RegisterUseCase } from "./register";
import { User } from "@prisma/client";
import { compare } from "bcrypt";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";

let usersRepository: InMemoryUsersRepository;
let system: RegisterUseCase;

describe("User register test", (): void => {
  describe("when registering an user", () => {
    beforeEach(() => {
      usersRepository = new InMemoryUsersRepository();
      system = new RegisterUseCase(usersRepository);
    });

    it("should able to register an user", async () => {
      const response: User = await system.execute({
        name: "Maluco123",
        email: "maluco123@email.com",
        password: "4455669",
      });

      expect(response.id).toEqual(expect.any(String));
    });

    it("should hash user password upon registration", async () => {
      const password = "my-secret-password";

      const user = await system.execute({
        name: "ÓosCaraVéioKKKKKKKK",
        email: "apenas@hmm.com",
        password,
      });

      const isPasswordCorrectlyHashed = await compare(
        password,
        user.password_hash,
      );
      expect(isPasswordCorrectlyHashed).toBe(true);
    });

    it("should not be able to register with same email twice", async () => {
      const email = "duplicate@email.com";

      await system.execute({
        name: "User 1",
        email,
        password: "password123",
      });

      await expect(() =>
        system.execute({
          name: "User 2",
          email,
          password: "password123",
        }),
      ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
  });
});
