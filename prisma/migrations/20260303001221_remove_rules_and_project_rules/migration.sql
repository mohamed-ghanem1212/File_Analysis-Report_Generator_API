/*
  Warnings:

  - You are about to drop the `Audit_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectRule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Audit_log" DROP CONSTRAINT "Audit_log_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectRule" DROP CONSTRAINT "ProjectRule_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectRule" DROP CONSTRAINT "ProjectRule_ruleId_fkey";

-- DropTable
DROP TABLE "Audit_log";

-- DropTable
DROP TABLE "ProjectRule";

-- DropTable
DROP TABLE "Rule";
