import z from "zod";

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

export const submitAuditSchema = z.object({
  photos: z
    .array(
      z
        .string({ message: "Each photo must be a valid string." })
        .url("Each photo must be a valid URL format."),
    )
    .min(3, "You must provide at least 3 photos to complete the audit."),

  notes: z.string({ message: "Notes must be a text string." }).nullish(),
});

export const submitAuditParamsSchema = z.object({
  audit_id: z.uuid("Invalid audit ID format. It must be a valid UUID."),
});
