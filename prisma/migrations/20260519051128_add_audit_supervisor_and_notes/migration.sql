-- AlterTable
ALTER TABLE "audits" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "supervisor_id" TEXT,
ADD COLUMN     "supervisor_review" TEXT;

-- AddForeignKey
ALTER TABLE "audits" ADD CONSTRAINT "audits_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
