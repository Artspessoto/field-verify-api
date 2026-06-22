import { Token } from "@prisma/client";
import dayjs from "dayjs";
import { ITokensRepository } from "~/repositories/tokens-repository";
import { IUsersRepository } from "~/repositories/users-repository";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";

export interface ISendPasswordResetUseCaseReq {
  email: string; //recovery email
}

export class SendPasswordResetUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private tokensRepository: ITokensRepository,
  ) {}

  async execute({
    email,
  }: ISendPasswordResetUseCaseReq): Promise<{ token: Token }> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new ResourceNotFoundError();

    const expiresIn = dayjs().add(2, "hours").toDate();

    const token = await this.tokensRepository.create({
      user_id: user.id,
      type: "PASSWORD_RESET",
      expires_at: expiresIn,
    });

    return { token };
  }
}
