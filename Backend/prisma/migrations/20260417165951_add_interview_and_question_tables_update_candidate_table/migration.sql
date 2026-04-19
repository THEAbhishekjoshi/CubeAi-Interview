/*
  Warnings:

  - The `status` column on the `Candidate` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('LINK_NOT_SENT', 'INTERVIEW_PENDING', 'INTERVIEW_COMPLETED', 'SELECTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('PENDING', 'COMPLETED');

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "status",
ADD COLUMN     "status" "CandidateStatus" NOT NULL DEFAULT 'LINK_NOT_SENT';

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "status" "InterviewStatus" NOT NULL DEFAULT 'PENDING',
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "overallScore" DOUBLE PRECISION,
    "feedback" TEXT,
    "rubricScores" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "answerText" TEXT,
    "analysis" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Interview_token_key" ON "Interview"("token");

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
