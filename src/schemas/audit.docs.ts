import z from "zod";
import {
  checkInSchemaParams,
  createCheckInBodySchema,
  auditResponseSchema,
  auditParamsSchema,
  evaluateAuditBodySchema,
  agentAuditsHistoryQuerySchema,
  overrideAuditBodySchema,
  searchAuditsQuerySchema,
  submitAuditSchema,
  uploadPhotosSchema,
} from "./audit.schema";

const security = [{ bearerAuth: [] }];

export const checkInDoc = {
  tags: ["Audits"],
  summary: "Check-in at a merchant to start a new audit",
  security,
  params: checkInSchemaParams,
  body: createCheckInBodySchema,
  response: {
    201: z.object({ audit: auditResponseSchema }),
  },
};

export const detailsDoc = {
  tags: ["Audits"],
  summary: "Get audit details (Agent can view own, Admin can view any)",
  security,
  params: auditParamsSchema,
  response: {
    200: z.object({ audit: auditResponseSchema }),
  },
};

export const evaluateDoc = {
  tags: ["Audits"],
  summary: "Evaluate an audit (Admin only)",
  security,
  params: auditParamsSchema,
  body: evaluateAuditBodySchema,
  response: {
    200: z.object({ audit: auditResponseSchema }),
  },
};

export const historyDoc = {
  tags: ["Audits"],
  summary: "Get authenticated agent's audit history",
  security,
  querystring: agentAuditsHistoryQuerySchema,
  response: {
    200: z.object({
      audits: z.array(auditResponseSchema),
      totalCount: z.number(),
    }),
  },
};

export const overrideDoc = {
  tags: ["Audits"],
  summary: "Override an already evaluated audit decision (Admin only)",
  security,
  params: auditParamsSchema,
  body: overrideAuditBodySchema,
  response: {
    200: z.object({ audit: auditResponseSchema }),
  },
};

export const searchDoc = {
  tags: ["Audits"],
  summary: "Search and filter all audits (Admin only)",
  security,
  querystring: searchAuditsQuerySchema,
  response: {
    200: z.object({
      audits: z.array(auditResponseSchema),
      totalCount: z.number(),
    }),
  },
};

export const submitDoc = {
  tags: ["Audits"],
  summary: "Submit a completed audit with photos and coordinates (Agent only)",
  security,
  params: auditParamsSchema,
  body: submitAuditSchema,
  response: {
    200: z.object({ audit: auditResponseSchema }),
  },
};

export const uploadPhotosDoc = {
  tags: ["Audits"],
  summary: "Generate pre-signed URLs for direct photo upload to storage",
  security,
  params: auditParamsSchema,
  body: uploadPhotosSchema,
  response: {
    200: z.object({
      urls: z.array(
        z.object({
          uploadUrl: z.string().url(),
          finalUrl: z.string().url(),
        }),
      ),
    }),
  },
};
