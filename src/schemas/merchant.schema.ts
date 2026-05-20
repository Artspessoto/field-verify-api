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

export type MerchantSchema = z.infer<typeof merchantSchema>;
