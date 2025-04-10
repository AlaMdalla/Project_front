import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Evaluation} from "../../../models/Evaluation";
import {EvaluationService} from "../../../Services/evaluation.service";
import {QuestionService} from "../../../Services/question.service";
import {Question} from "../../../models/Question";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-ajout-evaluation',
  templateUrl: './ajout-evaluation.component.html',
  styleUrls: ['./ajout-evaluation.component.css']
})
export class AjoutEvaluationComponent {
  evaluationForm!: FormGroup;
  questionForm!: FormGroup;
  isSubmitted = false;
  successMessage = 'Eval ajoutée avec succès';

  constructor(private fb: FormBuilder, private evaluationService: EvaluationService, private questionService: QuestionService, private route: ActivatedRoute) {}


  ngOnInit(): void {
    const TrainingId = this.route.snapshot.paramMap.get('id');
    this.evaluationForm = this.fb.group({
      trainingId: [TrainingId, Validators.required],
      description: ['', Validators.required],
      type: ['QCM', Validators.required],
      evaluationDuration: ['', Validators.required],
      score: ['', Validators.required],
      niveau: ['', Validators.required],
      questions: this.fb.array([]) // Doit être un tableau d'objets QuestionReponseDTO si présent
    });
    this.questionForm = this.fb.group({
      questionText: ['', Validators.required],
      bonneReponse: ['', Validators.required],
      options: this.fb.array([]) // Tableau dynamique d'options
    });
  }

  get questions() {
    return this.evaluationForm.get('questions') as FormArray;
  }
  get options() {
    return this.evaluationForm.get('options') as FormArray;
  }

  // Fonction pour obtenir les options d'une question spécifique
  getOptionsControls(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  addQuestion(): void {
    const questionGroup = this.fb.group({
      questionText: ['', Validators.required],
      bonneReponse: ['', Validators.required],
      options: this.fb.array([]) // 👈 IMPORTANT : Initialiser un FormArray ici
    });
    this.questions.push(questionGroup);
  }

// Ajouter une option à une question spécifique
  addOption(questionIndex: number): void {
    const options = this.getOptionsControls(questionIndex);
    options.push(this.fb.control('', Validators.required)); // 👈 Ajouter un FormControl dans le FormArray
  }

  onSubmit(): void {
    if (true) {
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
      // for (const control of this.questions.controls) {
      //   const question = control.value; //  Extraire les données de chaque FormGroup
      //
      //   this.questionService.addQuestion(question).subscribe({
      //     next: (response) => {
      //       console.log('Question ajoutée avec succès !', response);
      //       this.successMessage = 'Question ajoutée avec succès !';
      //       this.isSubmitted = true;
      //       this.questionForm.reset();
      //     },
      //     error: (error) => {
      //       console.error('Erreur lors de l’ajout de la question', error);
      //     }
      //   });
      // }
    } else {
      console.warn('Le formulaire est invalide');
    }
  }


  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }




  removeOption(questionIndex: number, optionIndex: number): void {
    const options = this.getOptionsControls(questionIndex);
    options.removeAt(optionIndex);
  }


}
