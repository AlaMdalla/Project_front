import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {QuestionService} from "../Services/question.service";


@Component({
  selector: 'app-reponse',
  templateUrl: './reponse.component.html',
  styleUrls: ['./reponse.component.css']
})
export class ReponseComponent implements OnInit {
  questions: any[] = []; // Stocke les questions récupérées
  selectedAnswers: { [key: number]: string } = {}; // Stocke les réponses utilisateur
  currentEvaluationId = 1; // ID de l'évaluation en cours (à adapter)

  constructor(private questionService: QuestionService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  // Charger les questions depuis le backend
  loadQuestions() {
    this.questionService.getQuestions().subscribe(
      (data) => {
        this.questions = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des questions', error);
      }
    );
  }

  // Soumettre la réponse de l'utilisateur
  submitReponses() {
    const reponses = this.questions.map((question) => ({
      reponse: this.selectedAnswers[question.idQuestion] || '', // Réponse sélectionnée
      estCorrect: false, // Vérifié côté backend
      scoreObtenu: 0, // Calculé après soumission
      evaluation: { idEvaluation: this.currentEvaluationId },
      question: { idQuestion: question.idQuestion }
    }));

    this.http.post('http://localhost:8089/reponse/add-multiple', reponses).subscribe(
      (response) => {
        console.log('Réponses ajoutées avec succès', response);
      },
      (error) => {
        console.error('Erreur lors de l\'ajout des réponses', error);
      }
    );
  }
}
