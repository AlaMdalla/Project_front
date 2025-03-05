import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Evaluation} from "../../../models/Evaluation";
import {EvaluationService} from "../../../Services/evaluation.service";

@Component({
  selector: 'app-ajout-evaluation',
  templateUrl: './ajout-evaluation.component.html',
  styleUrls: ['./ajout-evaluation.component.css']
})
export class AjoutEvaluationComponent {
  evaluationForm!: FormGroup;
  isSubmitted = false;
  successMessage = '';

  constructor(private fb: FormBuilder, private evaluationService: EvaluationService) {}


  ngOnInit(): void {
    this.evaluationForm = this.fb.group({
      training_id: ['', Validators.required],
      description: ['', Validators.required],
      evaluation_duration: ['', Validators.required],
      score: ['', Validators.required],
      type: ['QCM', Validators.required],
      questions: this.fb.array([]) // Liste de questions
    });
  }

  get questions() {
    return this.evaluationForm.get('questions') as FormArray;
  }

  addQuestion(): void {
    const questionGroup = this.fb.group({
      question_text: ['', Validators.required],
      options: this.fb.array([])
    });
    this.questions.push(questionGroup);
  }

  addOption(questionIndex: number): void {
    const options = this.questions.at(questionIndex).get('options') as FormArray;
    options.push(this.fb.control('', Validators.required));
  }

  onSubmit(): void {
    if (this.evaluationForm.valid) {
      const evaluation: Evaluation = this.evaluationForm.value;

      this.evaluationService.addEvaluation(evaluation).subscribe({
        next: (response) => {
          console.log('Évaluation ajoutée avec succès !', response);
          this.successMessage = 'Évaluation ajoutée avec succès !';
          this.isSubmitted = true;
          this.evaluationForm.reset();
        },
        error: (error) => {
          console.error('Erreur lors de l’ajout de l’évaluation', error);
        }
      });
    } else {
      console.warn('Le formulaire est invalide');
    }
  }


  // Supprimer une question
  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  // Récupérer les options d'une question
  getOptionsControls(questionIndex: number) {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }


  // Supprimer une option d'une question
  removeOption(questionIndex: number, optionIndex: number): void {
    const options = this.getOptionsControls(questionIndex);
    options.removeAt(optionIndex);
  }


}
