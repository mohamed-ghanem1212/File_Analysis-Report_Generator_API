/*
  Warnings:

  - You are about to drop the column `entityTybe` on the `Audit_log` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId,ruleId]` on the table `ProjectRule` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branch` to the `Analysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityType` to the `Audit_log` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `action` on the `Audit_log` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Debt_Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileExtension` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Made the column `repositoryUrl` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `language` on the `Rule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('JAVASCRIPT', 'TYPESCRIPT', 'PYTHON', 'PHP', 'JAVA', 'GO', 'RUBY', 'CSHARP');

-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN     "branch" TEXT NOT NULL,
ADD COLUMN     "commitHash" TEXT,
ALTER COLUMN "summary" SET DEFAULT '{}',
ALTER COLUMN "totalFiles" SET DEFAULT 0,
ALTER COLUMN "totalLines" SET DEFAULT 0,
ALTER COLUMN "issuesFound" SET DEFAULT 0,
ALTER COLUMN "complexityScore" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Audit_log" DROP COLUMN "entityTybe",
ADD COLUMN     "entityType" TEXT NOT NULL,
DROP COLUMN "action",
ADD COLUMN     "action" "Action" NOT NULL,
ALTER COLUMN "oldValue" SET DEFAULT '{}',
ALTER COLUMN "newValue" SET DEFAULT '{}';

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Debt_Item" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'IDENTIFIED',
ALTER COLUMN "businessImpact" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "fileExtension" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Issue" ALTER COLUMN "suggestion" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Metric" ALTER COLUMN "metaData" SET DEFAULT '{}';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "branch" TEXT NOT NULL DEFAULT 'main',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "language" "Language" NOT NULL,
ALTER COLUMN "repositoryUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "content" SET DEFAULT '{}';

-- AlterTable
ALTER TABLE "Rule" ALTER COLUMN "config" SET DEFAULT '{}',
DROP COLUMN "language",
ADD COLUMN     "language" "Language" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProjectRule_projectId_ruleId_key" ON "ProjectRule"("projectId", "ruleId");
