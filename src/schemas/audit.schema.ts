import z from "zod";

const auditStatusEnum = z.enum(["APPROVED", "REJECTED", "FRAUD_SUSPECT"], {
  message: "Status must be APPROVED, REJECTED, or FRAUD_SUSPECT",
});

export const auditResponseSchema = z.object({
  id: z.uuid(),
  merchant_id: z.uuid(),
  user_id: z.uuid(),
  supervisor_id: z.uuid().nullable(),

  status: auditStatusEnum,

  photos: z.array(z.url()),
  notes: z.string().nullable(),
  supervisor_review: z.string().nullable(),

  check_in_lat: z.number(),
  check_in_long: z.number(),
  check_out_lat: z.number().nullable(),
  check_out_long: z.number().nullable(),

  check_in_at: z.date(),
  check_out_at: z.date().nullable(),
  validated_at: z.date().nullable(),
  updated_at: z.date(),
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

export const uploadPhotosSchema = z.object({
  files: z
    .array(
      z.object({
        fileName: z.string(),
        contentType: z
          .string()
          .regex(/^image\//, "Only image files are allowed"),
      }),
    )
    .min(3, "You must provide metadata for at least 3 photos."),
});

export type CreateCheckInBodySchema = z.infer<typeof createCheckInBodySchema>;
export type CheckInSchemaParams = z.infer<typeof checkInSchemaParams>;
export type EvaluateAuditBodySchema = z.infer<typeof evaluateAuditBodySchema>;
export type OverrideAuditBodySchema = z.infer<typeof overrideAuditBodySchema>;
export type SubmitAuditBodySchema = z.infer<typeof submitAuditSchema>;
export type AgentAuditsHistoryQuerySchema = z.infer<
  typeof agentAuditsHistoryQuerySchema
>;
export type SearchAuditsQuerySchema = z.infer<typeof searchAuditsQuerySchema>;
export type AuditParamsSchema = z.infer<typeof auditParamsSchema>;
export type UploadPhotosBodySchema = z.infer<typeof uploadPhotosSchema>;
