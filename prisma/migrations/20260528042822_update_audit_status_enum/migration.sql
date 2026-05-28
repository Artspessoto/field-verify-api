/*
  Warnings:

  - The values [COMPLETED] on the enum `AuditStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AuditStatus_new" AS ENUM ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'FRAUD_SUSPECT');
ALTER TABLE "public"."audits" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "audits" ALTER COLUMN "status" TYPE "AuditStatus_new" USING ("status"::text::"AuditStatus_new");
ALTER TYPE "AuditStatus" RENAME TO "AuditStatus_old";
ALTER TYPE "AuditStatus_new" RENAME TO "AuditStatus";
DROP TYPE "public"."AuditStatus_old";
ALTER TABLE "audits" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
