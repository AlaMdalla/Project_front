import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Question } from '../models/Question';
import { QuestionService } from "../Services/question.service";

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {
  questionForm!: FormGroup;
  types: string[] = [
    'developpement_web',
    'developpement_mobile',
    'intelligence_artificielle',
    'bases_de_donnees',
    'securite_informatique',
    'reseaux',
    'systemes_embarques',
    'analyse_de_donnees',
    'administration_systemes',
    'devops'
  ];
  questions: Question[] = [];

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.questionForm = this.fb.group({
      questionText: ['', Validators.required], // Texte de la question
      type: ['', Validators.required],         // Type de la question
      enonce: ['', Validators.required],       // Intitulé de la question
      reponseCorrecte: ['', Validators.required], // Réponse correcte
      options: this.fb.array([])               // Liste des options
    });

    this.getQuestions();
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  // ✅ Ajouter une nouvelle option
  addOption(): void {
    this.options.push(this.fb.control('', Validators.required));
  }

  // ✅ Supprimer une option
  removeOption(index: number): void {
    this.options.removeAt(index);
  }

  // ✅ Soumettre le formulaire et envoyer à l'API
  onSubmit(): void {
    if (this.questionForm.valid) {
      const questionData = {
        ...this.questionForm.value,
        options: this.options.value // Liste des options
      };

      this.questionService.addQuestion(questionData).subscribe(response => {
        console.log('Question ajoutée avec succès', response);
        this.getQuestions(); // Mettre à jour la liste des questions
      });
    }
  }

  // ✅ Récupérer toutes les questions
  getQuestions(): void {
    this.questionService.getQuestions().subscribe(questions => {
      this.questions = questions;
    });
  }
}
