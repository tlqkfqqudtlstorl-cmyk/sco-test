// ========================================
// sco Type Definitions
// ========================================

// ----------------------------------------
// User & Auth
// ----------------------------------------

export type UserRole = 'USER' | 'REVIEWER' | 'ADMIN' | 'SUPER_ADMIN';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'DELETED';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  rating: number;
  tier: UserTier;
  solvedCount: number;
  verifiedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type UserTier = 
  | 'NEWBIE' 
  | 'BRONZE' 
  | 'SILVER' 
  | 'GOLD' 
  | 'PLATINUM' 
  | 'DIAMOND' 
  | 'MASTER' 
  | 'GRANDMASTER' 
  | 'LEGEND';

export interface UserProfile {
  userId: string;
  bio: string;
  organization: string;
  github: string;
  blog: string;
  avatarUrl: string;
}

// ----------------------------------------
// Problem
// ----------------------------------------

export type ProblemType = 
  | 'STANDARD' 
  | 'VERIFIED' 
  | 'CODE_PATCH' 
  | 'DEBUGGING' 
  | 'COUNTEREXAMPLE' 
  | 'INTERACTIVE' 
  | 'OPTIMIZATION' 
  | 'CONTEST_ONLY' 
  | 'ASSIGNMENT';

export type ProblemDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type ProblemStatus = 
  | 'DRAFT' 
  | 'REVIEW_REQUESTED' 
  | 'IN_REVIEW' 
  | 'NEEDS_FIX' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'PUBLISHED' 
  | 'ARCHIVED';

export type UserProblemStatus = 
  | 'UNSOLVED' 
  | 'TRIED' 
  | 'WRONG_ANSWER' 
  | 'AC' 
  | 'VERIFIED_AC' 
  | 'PENDING_REVIEW' 
  | 'RANKING_REJECTED';

export interface Problem {
  id: string;
  number: number;
  title: string;
  type: ProblemType;
  premium: boolean;
  difficulty: ProblemDifficulty;
  status: ProblemStatus;
  tags: string[];
  
  // Limits
  timeLimit: number; // ms
  memoryLimit: number; // MB
  
  // Content
  description: string;
  inputDescription: string;
  outputDescription: string;
  examples: ProblemExample[];
  hint?: string;
  
  // Verified requirements
  requiresExplanation: boolean;
  requiresUnderstanding: boolean;
  requiresCodePatch: boolean;
  
  // Stats
  submissionCount: number;
  acCount: number;
  verifiedCount: number;
  acceptanceRate: number;
  
  // Meta
  authorId: string;
  reviewerId?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

/** 서버에서 클라이언트로 넘길 때 사용 (Date → ISO 문자열). */
export type ProblemClient = Omit<Problem, 'createdAt' | 'updatedAt' | 'publishedAt'> & {
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

export type ProblemListItemClient = ProblemClient & {
  categorySlug: string;
  categoryName: string;
  subCategorySlug: string | null;
  subCategoryName: string | null;
};

/** 문제 목록 사이드바 — 서버에서 직렬화해 클라이언트로 전달 */
export type CategoryNav = {
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  order: number;
  subCategories: { slug: string; name: string; order: number }[];
};

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ProblemTag {
  id: string;
  name: string;
  slug: string;
  category: string;
  problemCount: number;
}

// ----------------------------------------
// Submission & Judging
// ----------------------------------------

export type SubmissionStatus = 
  | 'PENDING' 
  | 'RUNNING' 
  | 'AC' 
  | 'WA' 
  | 'TLE' 
  | 'MLE' 
  | 'RE' 
  | 'CE' 
  | 'PE' 
  | 'OLE' 
  | 'JE';

export type VerificationStatus = 
  | 'NOT_REQUIRED' 
  | 'PENDING_EXPLANATION' 
  | 'PENDING_UNDERSTANDING' 
  | 'PENDING_PATCH' 
  | 'PENDING_REVIEW' 
  | 'VERIFIED' 
  | 'REJECTED';

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  language: string;
  code: string;
  codeLength: number;
  
  // Results
  status: SubmissionStatus;
  verificationStatus: VerificationStatus;
  
  // Metrics
  executionTime?: number;
  memoryUsage?: number;
  
  // Testcase results
  testcaseResults: TestcaseResult[];
  
  // Integrity
  integrityScore: number;
  integrityFlags: string[];
  
  // Timestamps
  createdAt: Date;
  judgedAt?: Date;
}

export interface TestcaseResult {
  testcaseId: string;
  bucket: string;
  status: SubmissionStatus;
  time: number;
  memory: number;
}

// ----------------------------------------
// Verified AC
// ----------------------------------------

export interface SubmissionExplanation {
  submissionId: string;
  algorithm: string;
  coreIdea: string;
  timeComplexity: string;
  spaceComplexity: string;
  counterexamples: string;
  justification: string;
  createdAt: Date;
}

export interface UnderstandingQuestion {
  id: string;
  problemId: string;
  question: string;
  type: 'CHOICE' | 'SHORT_ANSWER';
  options?: string[];
  correctAnswer: string;
}

export interface UnderstandingAnswer {
  questionId: string;
  submissionId: string;
  answer: string;
  isCorrect: boolean;
}

export interface CodePatchMission {
  id: string;
  problemId: string;
  description: string;
  modificationHint: string;
  testInput: string;
  expectedOutput: string;
}

// ----------------------------------------
// Contest
// ----------------------------------------

export type ContestStatus = 
  | 'UPCOMING' 
  | 'REGISTERING' 
  | 'RUNNING' 
  | 'FROZEN' 
  | 'FINISHED' 
  | 'REVEALED';

export type ContestFormat = 'ICPC' | 'IOI' | 'CUSTOM';

export interface Contest {
  id: string;
  slug: string;
  title: string;
  description: string;
  format: ContestFormat;
  status: ContestStatus;
  
  // Schedule
  startTime: Date;
  endTime: Date;
  freezeTime?: Date;
  
  // Settings
  isPublic: boolean;
  isRated: boolean;
  maxParticipants?: number;
  
  // Participation
  participantCount: number;
  problemCount: number;
  
  createdAt: Date;
}

export interface ContestParticipation {
  contestId: string;
  userId: string;
  registeredAt: Date;
  isDisqualified: boolean;
  disqualificationReason?: string;
}

// ----------------------------------------
// Ranking
// ----------------------------------------

export type RankingType = 'PRACTICE' | 'VERIFIED' | 'CONTEST' | 'SEASON';

export interface RankingEntry {
  rank: number;
  userId: string;
  username: string;
  tier: UserTier;
  score: number;
  solvedCount: number;
  verifiedCount: number;
}

// ----------------------------------------
// Integrity
// ----------------------------------------

export type IntegrityRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface IntegritySignal {
  id: string;
  submissionId: string;
  type: string;
  value: number;
  weight: number;
  description: string;
  createdAt: Date;
}

export interface ReviewCase {
  id: string;
  submissionId: string;
  reviewerId?: string;
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'ESCALATED';
  riskScore: number;
  riskLevel: IntegrityRiskLevel;
  signals: IntegritySignal[];
  decision?: ReviewDecision;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface ReviewDecision {
  action: 'APPROVE' | 'REJECT_RANKING' | 'REQUEST_EXPLANATION' | 'ESCALATE' | 'WARN';
  reason: string;
  decidedBy: string;
  decidedAt: Date;
}

// ----------------------------------------
// Community
// ----------------------------------------

export interface DiscussionPost {
  id: string;
  problemId?: string;
  authorId: string;
  title: string;
  content: string;
  isSpoiler: boolean;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
}

export interface SolutionPost {
  id: string;
  problemId: string;
  authorId: string;
  title: string;
  content: string;
  language: string;
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  visibility: 'PUBLIC' | 'AC_ONLY' | 'VERIFIED_ONLY' | 'PRIVATE';
  likeCount: number;
  createdAt: Date;
}
