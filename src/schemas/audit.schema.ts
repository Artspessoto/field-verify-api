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
  merchant_id: z.uuid("Invalid merchant ID format"),
});
