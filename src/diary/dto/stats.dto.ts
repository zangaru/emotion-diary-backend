export interface EmotionCount {
  emotion: string;
  count: number;
}

export interface MonthlyTrend {
  month: string;
  emotions: EmotionCount[];
}

export interface StatsResponse {
  totalDiaries: number;
  currentStreak: number;
  thisMonthCount: number;
  emotionCounts: EmotionCount[];
  monthlyTrend: MonthlyTrend[];
  mostFrequentEmotion: string | null;
}
