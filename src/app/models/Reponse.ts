import {Question} from './Question';
import {Evaluation} from "./Evaluation";





export interface Reponse {
  idReponse?: number;
  reponse: string; // Réponse saisie par l'utilisateur
  choixUtilisateur: string; // Le choix fait par l'utilisateur
  estCorrect: boolean;
  scoreObtenu: number;
  evaluation: Evaluation;
  question: Question;
}
