import { z } from "zod";
import {
  merchantSchema,
  merchantParamsSchema,
  nearbyMerchantsSchema,
  searchMerchantSchema,
  updateMerchantSchema,
  merchantResponseSchema,
} from "./merchant.schema";

const security = [{ bearerAuth: [] }];

export const registerMerchantDoc = {
  tags: ["Merchants"],
  summary: "Register a new merchant",
  security,
  body: merchantSchema,
  response: {
    201: z.null(),
  },
};

export const updateMerchantDoc = {
  tags: ["Merchants"],
  summary: "Update merchant details",
  security,
  params: merchantParamsSchema,
  body: updateMerchantSchema,
  response: {
    200: z.object({ merchant: merchantResponseSchema }),
  },
};

export const searchMerchantsDoc = {
  tags: ["Merchants"],
  summary: "List and filter merchants",
  security,
  querystring: searchMerchantSchema,
  response: {
    200: z.object({
      merchants: z.array(merchantResponseSchema),
      totalCount: z.number(),
    }),
  },
};

export const nearbyMerchantsDoc = {
  tags: ["Merchants"],
  summary: "Fetch nearby merchants based on user coordinates",
  security,
  querystring: nearbyMerchantsSchema,
  response: {
    200: z.object({
      merchants: z.array(merchantResponseSchema),
    }),
  },
};

export const merchantDetailsDoc = {
  tags: ["Merchants"],
  summary: "Get merchant details by ID",
  security,
  params: merchantParamsSchema,
  response: {
    200: z.object({ merchant: merchantResponseSchema }),
  },
};
