/*
  Warnings:

  - Added the required column `updated_at` to the `audits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "audits" ADD COLUMN     "check_out_at" TIMESTAMP(3),
ADD COLUMN     "check_out_lat" DOUBLE PRECISION,
ADD COLUMN     "check_out_long" DOUBLE PRECISION,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
