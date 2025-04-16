import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Question, type} from "../models/Question";


@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {
  questionForm: FormGroup;
  types: string[] = Object.values(type);
  questions: Question[] = []; // Liste de questions pour l'exemple

  // Compteur pour l'auto-incrémentation
  private currentId: number = 1;

  // Variable pour la question sélectionnée (pour l'édition)
  selectedQuestion: Question | null = null;

  constructor(private fb: FormBuilder) {
    // Initialisation du formulaire
    this.questionForm = this.fb.group({
      questionText: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Exemple d'initialisation de quelques questions
    this.questions = [
      { questionId: 1, questionText: 'What is Angular?', type: type.developpement_web },
      { questionId: 2, questionText: 'What is TypeScript?', type: type.developpement_web },
    ];
    this.updateCurrentId(); // Mettre à jour l'ID actuel à partir des données existantes
  }

  // Méthode pour ajouter ou éditer une question
  onSubmit() {
    if (this.questionForm.invalid) {
      return;
    }

    if (this.selectedQuestion) {
      // Si une question est sélectionnée, on met à jour cette question
      this.selectedQuestion.questionText = this.questionForm.value.questionText;
      this.selectedQuestion.type = this.questionForm.value.type;
    } else {
      // Sinon, on ajoute une nouvelle question avec un ID auto-incrémenté
      const newQuestion: Question = {
        questionId: this.currentId, // Utiliser l'ID auto-incrémenté
        questionText: this.questionForm.value.questionText,
        type: this.questionForm.value.type
      };
      this.questions.push(newQuestion);
      this.currentId++; // Incrémenter l'ID
    }

    // Réinitialiser le formulaire après soumission
    this.questionForm.reset();
    this.selectedQuestion = null; // Réinitialiser la question sélectionnée
  }

  // Méthode pour éditer une question existante
  editQuestion(question: Question) {
    this.selectedQuestion = question;
    this.questionForm.setValue({
      questionText: question.questionText,
      type: question.type
    });
  }

  // Méthode pour mettre à jour le compteur currentId à partir des questions existantes
  private updateCurrentId() {
    if (this.questions.length > 0) {
      // Trouver le plus grand ID existant
      this.currentId = Math.max(...this.questions.map(q => q.questionId)) + 1;
    }
  }
}