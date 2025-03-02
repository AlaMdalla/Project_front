import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Evaluation } from "../models/Evaluation";
import {Question, type} from "../models/Question";

@Component({
  selector: 'app-add-evaluation',
  templateUrl: './add-evaluation.component.html',
  styleUrls: ['./add-evaluation.component.css']
})
export class AddEvaluationComponent implements OnInit {
  evaluationsForm: FormGroup;
  questions: Question[] = [];  // Liste des questions disponibles
  selectedQuestions: Question[] = []; // Questions sélectionnées
  selectedEvaluation: Evaluation | null = null;

  constructor(private fb: FormBuilder) {
    this.evaluationsForm = this.fb.group({
      description: ['', Validators.required],
      category: ['', Validators.required],
      evaluationDuration: ['', Validators.required],
      score: ['', [Validators.required, Validators.min(0)]],
      certificat: [false],
      selectedQuestions: [[]]  // Stocke les IDs des questions sélectionnées
    });
  }

  ngOnInit(): void {
    // Simulation de questions disponibles (remplace ça par une API si besoin)
    this.questions = [
      { questionId: 1, questionText: 'What is Angular?', type: type.developpement_web },
      { questionId: 2, questionText: 'What is TypeScript?', type:type.developpement_web },
      { questionId: 3, questionText: 'Is JavaScript synchronous?',  type:type.developpement_web  }
    ];

    // Si une évaluation existante est sélectionnée
    if (this.selectedEvaluation) {
      this.evaluationsForm.patchValue(this.selectedEvaluation);
      this.selectedQuestions = this.selectedEvaluation.questions || [];
    }
  }

  // Méthode pour soumettre le formulaire
  onSubmit(): void {
    if (this.evaluationsForm.valid) {
      const evaluationData: Evaluation = {
        ...this.evaluationsForm.value,
        questions: this.selectedQuestions
      };
      console.log('Evaluation Data:', evaluationData);
      // Logique pour sauvegarder l'évaluation (Appel API)
    }
  }

  // Méthode pour gérer la sélection des questions
  toggleQuestionSelection(question: Question): void {
    const index = this.selectedQuestions.findIndex(q => q.questionId === question.questionId);
    if (index === -1) {
      this.selectedQuestions.push(question);
    } else {
      this.selectedQuestions.splice(index, 1);
    }
  }

  // Méthode pour annuler
  closeForm(): void {
    this.evaluationsForm.reset();
    this.selectedQuestions = [];
  }
}
