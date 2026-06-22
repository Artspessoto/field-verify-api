import { hash } from "bcrypt";
import { ITokensRepository } from "~/repositories/tokens-repository";
import { IUsersRepository } from "~/repositories/users-repository";
import { InvalidTokenError } from "~/use-cases/errors/invalid-token-error";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";
import { TokenExpiredError } from "~/use-cases/errors/token-expired-error";

export interface IResetPasswordUseCaseReq {
  tokenString: string;
  password: string; //new password
}

export class ResetPasswordUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private tokensRepository: ITokensRepository,
  ) {}

  async execute({
    password,
    tokenString,
  }: IResetPasswordUseCaseReq): Promise<void> {
    const token = await this.tokensRepository.findByToken(tokenString);

    if (!token) throw new InvalidTokenError();

    if (token.type !== "PASSWORD_RESET") throw new InvalidTokenError();

    if (new Date() > token.expires_at) throw new TokenExpiredError();

    const user = await this.usersRepository.findById(token.user_id);

    if (!user) throw new ResourceNotFoundError();

    const passwordHash = await hash(password, 6);

    user.password_hash = passwordHash;

    await this.usersRepository.save(user);

    await this.tokensRepository.delete(token.id);
  }
}
