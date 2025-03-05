import {Question} from "./Question";

export interface Evaluation {
  idEvaluation: number;
  training_id: number;
  description: string;
  type: string;
  evaluation_duration: string;
  score: number;
  createdAt: Date;
  certificat: boolean;
  questions?: Question[];
}



