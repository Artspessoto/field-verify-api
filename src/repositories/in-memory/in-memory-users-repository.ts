import { Prisma, User, Role } from "@prisma/client";
import { IUsersRepository } from "../users-repository";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements IUsersRepository {
  public users: User[] = [];

  async create(data: Prisma.UserUncheckedCreateInput): Promise<User> {
    const user: User = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      role: data.role ?? "AGENT",
      email_verified_at: data.email_verified_at
        ? new Date(data.email_verified_at)
        : null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email == email);

    if (!user) return null;

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id == id);

    if (!user) return null;

    return user;
  }

  async save(user: User): Promise<User> {
    const userIndex: number = this.users.findIndex(
      (element) => element.id == user.id,
    );

    if (userIndex >= 0) {
      this.users[userIndex] = user;
    }
    return user;
  }

  async findMany(query: string, page: number, role?: Role): Promise<User[]> {
    return this.users
      .filter((user) => {
        //filter with case sensitive
        const matches =
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase());

        //filter by role (without impediment if dont have role arg)
        const matchesRole = role ? user.role == role : true;

        return matches && matchesRole;
      })
      .slice((page - 1) * 20, page * 20);
  }

  async countMany(query: string): Promise<number> {
    return this.users.filter((user) => {
      return (
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
    }).length;
  }
}
