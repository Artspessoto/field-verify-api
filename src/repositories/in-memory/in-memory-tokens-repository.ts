import { Prisma, Token } from "@prisma/client";
import { ITokensRepository } from "../tokens-repository";
import { randomUUID } from "node:crypto";

export class InMemoryTokensRepository implements ITokensRepository {
  public tokens: Token[] = [];

  async create(data: Prisma.TokenUncheckedCreateInput): Promise<Token> {
    const token: Token = {
      id: data.id ?? randomUUID(),
      token: data.token ?? randomUUID(),
      type: data.type,
      user_id: data.user_id,
      created_at: new Date(),
      expires_at: new Date(data.expires_at),
    };

    this.tokens.push(token);

    return token;
  }

  async findByToken(token: string): Promise<Token | null> {
    const findedToken = this.tokens.find((item) => item.id == token);

    if (!findedToken) return null;

    return findedToken;
  }

  async delete(id: string): Promise<void> {
    const tokenIndex = this.tokens.findIndex((item) => item.id == id);

    if (tokenIndex >= 0) this.tokens.splice(tokenIndex, 1);
  }
}
