import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "~/repositories/in-memory/in-memory-users-repository";
import { RegisterUseCase } from "./register";
import { compare } from "bcrypt";
import { UserAlreadyExistsError } from "../../errors/user-already-exists-error";
import { InMemoryTokensRepository } from "~/repositories/in-memory/in-memory-tokens-repository";
import { InMemoryMailProvider } from "~/providers/in-memory/in-memory-mail-provider";

let usersRepository: InMemoryUsersRepository;
let tokensRepository: InMemoryTokensRepository;
let mailProvider: InMemoryMailProvider;
let system: RegisterUseCase;

describe("User register test", (): void => {
  describe("when registering an user", () => {
    beforeEach(() => {
      usersRepository = new InMemoryUsersRepository();
      tokensRepository = new InMemoryTokensRepository();
      mailProvider = new InMemoryMailProvider();

      system = new RegisterUseCase(
        usersRepository,
        tokensRepository,
        mailProvider,
      );
    });

    it("should able to register an user", async () => {
      const { user } = await system.execute({
        name: "Maluco123",
        document: "214.099.400-04", //cpf generator
        email: "maluco123@email.com",
        password: "4455669",
      });

      expect(user.id).toEqual(expect.any(String));
    });

    it("should hash user password upon registration", async () => {
      const password = "my-secret-password";

      const { user } = await system.execute({
        name: "ÓosCaraVéioKKKKKKKK",
        document: "214.099.400-04", //cpf generator
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
        document: "214.099.400-04", //cpf generator
        email,
        password: "password123",
      });

      await expect(() =>
        system.execute({
          name: "User 2",
          document: "214.099.400-04", //cpf generator
          email,
          password: "password123",
        }),
      ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });

    it("should create a verification token and send an email", async () => {
      await system.execute({
        name: "User Mail Test",
        document: "214.099.400-04",
        email: "mailtest@email.com",
        password: "password123",
      });

      expect(tokensRepository.tokens).toHaveLength(1);
      expect(tokensRepository.tokens[0].type).toBe("EMAIL_VERIFICATION");

      expect(mailProvider.emails).toHaveLength(1);
      expect(mailProvider.emails[0].to).toBe("mailtest@email.com");
      expect(mailProvider.emails[0].body).toContain(
        "been successfully created",
      );
    });
  });
});
