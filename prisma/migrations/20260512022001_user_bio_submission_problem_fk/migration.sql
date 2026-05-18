-- AlterTable
ALTER TABLE "users" ADD COLUMN "bio" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_submissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "execTime" INTEGER,
    "memory" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "submissions_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_submissions" ("code", "createdAt", "execTime", "id", "language", "memory", "problemId", "status", "userId") SELECT "code", "createdAt", "execTime", "id", "language", "memory", "problemId", "status", "userId" FROM "submissions";
DROP TABLE "submissions";
ALTER TABLE "new_submissions" RENAME TO "submissions";
CREATE INDEX "submissions_userId_problemId_idx" ON "submissions"("userId", "problemId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
