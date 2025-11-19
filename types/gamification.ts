
export interface QuestStep {
  id: string;
  title: string;
  description: string;
  date: string;
  question?: string; // Optional interaction
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: string; // e.g., "Hadi", "Politikai", "Kultúra"
  steps: QuestStep[];
  badgeId: string; // ID of the badge earned upon completion
  difficulty: 'Könnyű' | 'Közepes' | 'Nehéz';
}

export interface DetectiveChallenge {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
  topic: string;
  difficulty: number; // 1-3
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji or icon name
  colorClass: string; // Tailwind gradient class
}

export interface UserProgress {
  totalPoints: number;
  completedQuestIds: string[];
  earnedBadgeIds: string[];
  detectiveStreak: number;
}
