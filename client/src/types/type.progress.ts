export interface ProgressStats {
  day?: string; // week or month label
  month?: string;
  week?: string
  completedTasks: number;
  inProgress: number;
}

export interface OverallProgress {
  totalTasks: number;
  completedTasks: number;
  overallProgress: number;
}