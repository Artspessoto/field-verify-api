import { Prisma, Token } from "@prisma/client";
import { ITokensRepository } from "../tokens-repository";
import prisma from "~/lib/prisma";

export class PrismaTokensRepository implements ITokensRepository {
  async create(data: Prisma.TokenUncheckedCreateInput): Promise<Token> {
    const token = await prisma.token.create({ data });

    return token;
  }

  async findByToken(token: string): Promise<Token | null> {
    const validatedToken = await prisma.token.findUnique({
      where: { token },
    });

    return validatedToken;
  }

  async delete(id: string): Promise<void> {
    await prisma.token.delete({ where: { id } });
  }
}
