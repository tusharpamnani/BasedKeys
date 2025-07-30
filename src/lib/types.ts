// Quiz Marketplace Types

export interface Quiz {
  id: string;
  title: string;
  description: string;
  hostFid: number;
  hostUsername: string;
  hostWalletAddress: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  entryFee: string; // in BLITZ tokens
  prizePool: string; // in BLITZ tokens
  maxParticipants: number;
  currentParticipants: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
  timeLimit: number; // in seconds
  order: number;
}

export interface QuizParticipant {
  id: string;
  quizId: string;
  fid: number;
  username: string;
  walletAddress: string;
  score: number;
  streak: number;
  answers: QuizAnswer[];
  joinedAt: Date;
  completedAt?: Date;
}

export interface QuizAnswer {
  id: string;
  participantId: string;
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  pointsEarned: number;
  answeredAt: Date;
}

export interface QuizResult {
  id: string;
  quizId: string;
  participantId: string;
  finalScore: number;
  rank: number;
  rewardAmount: string; // in BLITZ tokens
  claimed: boolean;
  claimedAt?: Date;
  createdAt: Date;
}

export interface QuizLeaderboard {
  quizId: string;
  participants: Array<{
    fid: number;
    username: string;
    score: number;
    rank: number;
    timeSpent: number;
  }>;
  updatedAt: Date;
}

// API Request/Response Types
export interface CreateQuizRequest {
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  entryFee: string;
  prizePool: string;
  maxParticipants: number;
  startTime: string;
  endTime: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
    points: number;
    timeLimit: number;
  }>;
  hostFid: number;
  hostUsername: string;
  hostWalletAddress: string;
}

export interface JoinQuizRequest {
  quizId: string;
  fid: number;
  username: string;
  walletAddress: string;
}

export interface SubmitAnswerRequest {
  quizId: string;
  questionId: string;
  selectedAnswer: string;
  timeSpent: number;
}

export interface ClaimRewardRequest {
  quizId: string;
  fid: number;
  walletAddress: string;
}

// Marketplace Types
export interface QuizMarketplace {
  featuredQuizzes: Quiz[];
  trendingQuizzes: Quiz[];
  categories: string[];
  totalQuizzes: number;
  totalParticipants: number;
  totalRewardsDistributed: string;
}

// User Profile Types
export interface UserProfile {
  fid: number;
  username: string;
  walletAddress: string;
  totalQuizzesHosted: number;
  totalQuizzesParticipated: number;
  totalRewardsEarned: string;
  totalRewardsDistributed: string;
  averageScore: number;
  bestRank: number;
  badges: string[];
  createdAt: Date;
} 