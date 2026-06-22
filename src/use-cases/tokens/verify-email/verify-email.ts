import { ITokensRepository } from "~/repositories/tokens-repository";
import { IUsersRepository } from "~/repositories/users-repository";
import { InvalidTokenError } from "~/use-cases/errors/invalid-token-error";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";
import { TokenExpiredError } from "~/use-cases/errors/token-expired-error";

export interface IVerifyEmailUseCaseReq {
  tokenString: string;
}

export class VerifyEmailUseCase {
  constructor(
    private usersRepositoy: IUsersRepository,
    private tokensRepository: ITokensRepository,
  ) {}

  async execute({ tokenString }: IVerifyEmailUseCaseReq): Promise<void> {
    const token = await this.tokensRepository.findByToken(tokenString);

    if (!token) throw new InvalidTokenError();

    if (token.type !== "EMAIL_VERIFICATION") throw new InvalidTokenError();

    if (new Date() > token.expires_at) throw new TokenExpiredError();

    const user = await this.usersRepositoy.findById(token.user_id);

    if (!user) throw new ResourceNotFoundError();

    user.email_verified_at = new Date();
    await this.usersRepositoy.save(user);

    await this.tokensRepository.delete(token.id);
  }
}
