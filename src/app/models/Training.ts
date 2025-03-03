export enum status
{ Planned,
  InProgress,
  Finished
}

export enum level {
  Beginner,
  Intermediate,
  Advanced
}
export interface Training {
  idTraining?: number;
  title: string;
  content: string;
  trainingdate: string;  // ⚠️ Format YYYY-MM-DD
  duration: string;
  status: status;
  level: level;
  videoUrl?: string;
}

