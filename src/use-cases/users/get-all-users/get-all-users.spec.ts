import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "~/repositories/in-memory/in-memory-users-repository";
import { GetAllUsersUseCase } from "./get-all-users";
import { hash } from "bcrypt";

let usersRepository: InMemoryUsersRepository;
let system: GetAllUsersUseCase;

describe("Get All Users Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    system = new GetAllUsersUseCase(usersRepository);
  });

  it("should be able to fetch a list of users and the total count", async () => {
    await usersRepository.create({
      name: "Arthur Spessoto",
      email: "arthur@example.com",
      document: "316.508.050-04",
      password_hash: await hash("123456", 6),
      role: "AGENT",
    });

    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      document: "316.508.050-04",
      password_hash: await hash("123456", 6),
      role: "AGENT",
    });

    const { users, totalCount } = await system.execute({
      query: "",
      page: 1,
    });

    expect(users).toHaveLength(2);
    expect(totalCount).toBe(2);
    expect(users[0].name).toEqual("Arthur Spessoto");
  });

  it("should be able to fetch paginated users", async () => {
    //create 22 users
    for (let i = 1; i <= 22; i++) {
      await usersRepository.create({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        document: `316.508.050-${i.toString().padStart(2, "0")}`,
        password_hash: await hash("123456", 6),
      });
    }

    //search into page 2
    const { users, totalCount } = await system.execute({
      query: "",
      page: 2,
    });

    expect(users).toHaveLength(2);
    expect(totalCount).toBe(22);
    expect(users[0].name).toEqual("User 21");
  });

  it("should be able to filter users by name or email (query)", async () => {
    await usersRepository.create({
      name: "Arthur Spessoto",
      email: "arthur@example.com",
      document: "316.508.050-04",
      password_hash: "hash",
    });

    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      document: "037.861.180-19",
      password_hash: "hash",
    });

    const { users, totalCount } = await system.execute({
      query: "Arthur",
      page: 1,
    });

    expect(users).toHaveLength(1);
    expect(totalCount).toBe(1);
    expect(users[0].name).toEqual("Arthur Spessoto");
  });

  it("should be able to filter users by role", async () => {
    await usersRepository.create({
      name: "Admin User",
      email: "admin@example.com",
      document: "037.861.180-19",
      password_hash: "hash",
      role: "ADMIN",
    });

    await usersRepository.create({
      name: "Agent User",
      email: "agent@example.com",
      document: "037.861.180-20",
      password_hash: "hash",
      role: "AGENT",
    });

    const { users, totalCount } = await system.execute({
      query: "",
      page: 1,
      role: "ADMIN",
    });

    expect(users).toHaveLength(1);
    expect(totalCount).toBe(1);
    expect(users[0].name).toEqual("Admin User");
    expect(users[0].role).toEqual("ADMIN");
  });
});
