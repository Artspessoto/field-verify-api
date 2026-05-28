import { Audit } from "@prisma/client";
import dayjs from "dayjs";
import { IAuditsRepository } from "~/repositories/audits-repository";
import { IUsersRepository } from "~/repositories/users-repository";
import { AuditAlreadySubmittedError } from "~/use-cases/errors/audit-already-submitted-error";
import { MinimumPhotosRequiredError } from "~/use-cases/errors/minimum-photos-required-error";
import { MinimumStayTimeNotMetError } from "~/use-cases/errors/minimum-stay-time-not-meet-error";
import { ResourceNotFoundError } from "~/use-cases/errors/resource-not-found-error";
import { UnauthorizedAuditAccessError } from "~/use-cases/errors/unauthorized-audit-access-error";
import { UserDeactivatedError } from "~/use-cases/errors/user-deactivated-error";
import { UserEmailNotVerifiedError } from "~/use-cases/errors/user-email-not-verified-error";

export interface ISubmitAuditUseCaseReq {
  auditId: string;
  userId: string;
  photos: string[];
  notes?: string | null;
}

export class SubmitAuditUseCase {
  constructor(
    private auditsRepository: IAuditsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    userId,
    auditId,
    photos,
    notes,
  }: ISubmitAuditUseCaseReq): Promise<{ audit: Audit }> {
    const [user, audit] = await Promise.all([
      this.usersRepository.findById(userId),
      this.auditsRepository.findById(auditId),
    ]);

    if (!user || !audit) throw new ResourceNotFoundError();
    if (!user.is_active) throw new UserDeactivatedError();
    if (!user.email_verified_at) throw new UserEmailNotVerifiedError();

    if (audit.user_id !== userId) throw new UnauthorizedAuditAccessError();
    if (audit.status !== "PENDING") throw new AuditAlreadySubmittedError();
    if (photos.length < 3) throw new MinimumPhotosRequiredError();

    const minutesSinceAgentCheckIn = dayjs().diff(audit.check_in_at, "minute");

    if (minutesSinceAgentCheckIn < 20) throw new MinimumStayTimeNotMetError();

    audit.photos = photos;
    audit.status = "IN_REVIEW";
    audit.notes = notes ?? null;

    const finishedAudit = await this.auditsRepository.save(audit);

    return { audit: finishedAudit };
  }
}
