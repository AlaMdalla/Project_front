export enum Status {
  PLANNED = 'PLANNED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED'
}

export enum Level {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export interface Training {
  idTraining?: number;
  title: string;
  content: string;
  trainingdate: string;  // ⚠️ Format YYYY-MM-DD
  duration: string;
  status: Status;
  level: Level;
}

