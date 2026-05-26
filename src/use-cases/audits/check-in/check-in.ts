import { IAuditsRepository } from "~/repositories/audits-repository";
import { IMerchantsRepository } from "~/repositories/merchants-repository";
import { ResourceNotFoundError } from "../../errors/resource-not-found-error";
import { CannotAuditInactiveMerchantError } from "../../errors/cannot-audit-inactive-merchant-error";
import { getDistanceBetweenCoordinates } from "~/utils/get-distance-between-coordinates";
import { MaxDistanceError } from "../../errors/max-distance-error";
import { MaxDailyAuditsError } from "../../errors/max-daily-audits-error";
import { AgentHasPendingAuditError } from "../../errors/agent-has-pending-audit-error";
import { Audit } from "@prisma/client";

export interface ICheckInUseCaseReq {
  userId: string;
  merchantId: string;
  userLatitude: number;
  userLongitude: number;
}

export class CheckInUseCase {
  constructor(
    private auditsRepository: IAuditsRepository,
    private merchantsRepository: IMerchantsRepository,
  ) {}

  async execute({
    merchantId,
    userId,
    userLatitude,
    userLongitude,
  }: ICheckInUseCaseReq): Promise<{ audit: Audit }> {
    const merchant = await this.merchantsRepository.findById(merchantId);

    if (!merchant) throw new ResourceNotFoundError();

    if (!merchant.is_active) throw new CannotAuditInactiveMerchantError();

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: merchant.latitude, longitude: merchant.longitude },
    );

    //0.1 -> distance in km (100m)
    if (distance > 0.1) throw new MaxDistanceError();

    const auditOnSameDay =
      await this.auditsRepository.findByAgentAndMerchantOnDate(
        userId,
        merchantId,
        new Date(),
      );

    if (auditOnSameDay) throw new MaxDailyAuditsError();

    const pendingAudit =
      await this.auditsRepository.findPendingByUserId(userId);

    if (pendingAudit) throw new AgentHasPendingAuditError();

    const audit = await this.auditsRepository.create({
      merchant_id: merchant.id,
      user_id: userId,
      check_in_lat: userLatitude,
      check_in_long: userLongitude,
    });

    return { audit };
  }
}
