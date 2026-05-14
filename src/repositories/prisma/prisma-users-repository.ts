import { Prisma, Role, User } from "@prisma/client";
import { IUsersRepository } from "../users-repository";
import prisma from "~/lib/prisma";

export class PrismaUsersRepository implements IUsersRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async create(data: Prisma.UserUncheckedCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }

  async save(user: User): Promise<User> {
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: user,
    });

    return updatedUser;
  }

  async findMany(query: string, page: number, role?: Role): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: {
        role: role,
        OR: query
          ? [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ]
          : undefined,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return users;
  }

  async countMany(query: string): Promise<number> {
    const count = await prisma.user.count({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    return count;
  }
}
