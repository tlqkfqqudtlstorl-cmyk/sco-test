ALTER TABLE "submissions" ADD COLUMN "codeLength" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "submissions" ADD COLUMN "verificationStatus" TEXT NOT NULL DEFAULT 'NOT_REQUIRED';
ALTER TABLE "submissions" ADD COLUMN "integrityScore" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "submissions" ADD COLUMN "integrityFlags" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "submissions" ADD COLUMN "judgedAt" DATETIME;

CREATE TABLE "submission_explanations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL,
    "coreIdea" TEXT NOT NULL,
    "timeComplexity" TEXT NOT NULL,
    "spaceComplexity" TEXT NOT NULL,
    "counterexamples" TEXT NOT NULL,
    "justification" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "submission_explanations_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "submission_explanations_submissionId_key" ON "submission_explanations"("submissionId");

CREATE TABLE "understanding_questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "problemId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'SHORT_ANSWER',
    "options" TEXT NOT NULL DEFAULT '[]',
    "correctAnswer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "understanding_questions_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "understanding_questions_problemId_idx" ON "understanding_questions"("problemId");

CREATE TABLE "understanding_answers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "understanding_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "understanding_questions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "understanding_answers_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "understanding_answers_questionId_submissionId_key" ON "understanding_answers"("questionId", "submissionId");

CREATE TABLE "code_patch_missions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "problemId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "modificationHint" TEXT NOT NULL,
    "testInput" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "code_patch_missions_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "code_patch_missions_problemId_idx" ON "code_patch_missions"("problemId");

CREATE TABLE "review_cases" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "reviewerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" DATETIME,
    CONSTRAINT "review_cases_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "review_cases_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "review_cases_submissionId_key" ON "review_cases"("submissionId");

CREATE TABLE "integrity_signals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reviewCaseId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "integrity_signals_reviewCaseId_fkey" FOREIGN KEY ("reviewCaseId") REFERENCES "review_cases" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "review_decisions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reviewCaseId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "decidedById" TEXT NOT NULL,
    "decidedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "review_decisions_reviewCaseId_fkey" FOREIGN KEY ("reviewCaseId") REFERENCES "review_cases" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "review_decisions_decidedById_fkey" FOREIGN KEY ("decidedById") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "review_decisions_reviewCaseId_key" ON "review_decisions"("reviewCaseId");
