import { Prisma, Role, User } from "@prisma/client";

export interface IUsersRepository {
  create(data: Prisma.UserUncheckedCreateInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByDocument(document: string): Promise<User | null>;
  save(user: User): Promise<User>;
  findMany(
    query: string,
    page: number,
    role?: Role,
    isActive?: boolean,
  ): Promise<User[]>; //return list of users (filtered by role)
  countMany(query: string, role?: Role, isActive?: boolean): Promise<number>; //total number of records for pagination
}
