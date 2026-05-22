import { cnpj } from "cpf-cnpj-validator";
import z from "zod";

export const merchantSchema = z.object({
  name: z.string().min(3, "Name must contain at least 3 characters"),
  address: z.string().nullable().default(null),
  latitude: z.number().refine((val) => Math.abs(val) <= 90, "Invalid latitude"),
  longitude: z
    .number()
    .refine((val) => Math.abs(val) <= 180, "Invalid longitude"),
  tax_identification: z.string().refine(
    (doc) => {
      const cleanDoc = doc.replace(/\D/g, "");
      return cnpj.isValid(cleanDoc);
    },
    {
      message: "Invalid CNPJ format.",
    },
  ),
});

export const updateMerchantSchema = merchantSchema
  .pick({
    name: true,
    address: true,
    latitude: true,
    longitude: true,
  })
  .partial()
  .extend({
    is_active: z.boolean().optional(),
  });

export const merchantParamsSchema = z.object({
  id: z.uuid("Invalid ID format"),
});

export const searchMerchantSchema = z.object({
  query: z.string().default(""),
  page: z.coerce.number().min(1).default(1),
  isActive: z.boolean(),
});

export type MerchantSchema = z.infer<typeof merchantSchema>;
