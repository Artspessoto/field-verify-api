import z from "zod";

const auditStatusEnum = z.enum(["APPROVED", "REJECTED", "FRAUD_SUSPECT"], {
  message: "Status must be APPROVED, REJECTED, or FRAUD_SUSPECT",
});

export const createCheckInBodySchema = z.object({
  latitude: z.number().refine((value) => {
    return Math.abs(value) <= 90;
  }),
  longitude: z.number().refine((value) => {
    return Math.abs(value) <= 180;
  }),
});

export const checkInSchemaParams = z.object({
  merchant_id: z.uuid("Invalid merchant ID format. It must be a valid UUID."),
});

export const evaluateAuditBodySchema = z.object({
  status: auditStatusEnum,
  supervisor_review: z.string().max(1000).optional(),
});

export const overrideAuditBodySchema = z.object({
  new_status: auditStatusEnum,
  justification: z
    .string()
    .min(10, "A justification of at least 10 characters is required.")
    .max(1000),
});

export const submitAuditSchema = z.object({
  photos: z
    .array(
      z
        .string({ message: "Each photo must be a valid string." })
        .url("Each photo must be a valid URL format."),
    )
    .min(3, "You must provide at least 3 photos to complete the audit."),

  notes: z.string({ message: "Notes must be a text string." }).nullish(),
  latitude: z.number().refine((value) => {
    return Math.abs(value) <= 90;
  }),
  longitude: z.number().refine((value) => {
    return Math.abs(value) <= 180;
  }),
});

export const agentAuditsHistoryQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
});

export const searchAuditsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  status: z
    .enum(["PENDING", "IN_REVIEW", "APPROVED", "REJECTED", "FRAUD_SUSPECT"])
    .optional(),
});

export const auditParamsSchema = z.object({
  audit_id: z.uuid("Invalid audit ID format. It must be a valid UUID."),
});
