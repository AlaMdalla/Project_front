import {Question} from "./Question";

export interface Evaluation {
  idEvaluation: number;
  trainingId: number;
  description: string;
  type: string;
  evaluationDuration: string;
  score: number;
  createdAt: Date;
  certificat: boolean;
  niveau: 'Beginner' | 'Intermediate' | 'Advanced';
  questions?: Question[];
}



