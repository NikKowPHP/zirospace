/*
  Warnings:

  - Added the required column `subtitle` to the `zirospace_case_studies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "zirospace_case_studies" ADD COLUMN     "subtitle" TEXT NOT NULL;
