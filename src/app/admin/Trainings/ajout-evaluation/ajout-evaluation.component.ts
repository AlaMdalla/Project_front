import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Evaluation} from "../../../models/Evaluation";
import {EvaluationService} from "../../../Services/evaluation.service";
import { TrainingService } from 'src/app/Services/training.service';

@Component({
  selector: 'app-ajout-evaluation',
  templateUrl: './ajout-evaluation.component.html',
  styleUrls: ['./ajout-evaluation.component.css']
})
export class AjoutEvaluationComponent {
  evaluationForm!: FormGroup;
  trainings: any[] = []; // Store available trainings
  isSubmitted = false;
  successMessage = '';

  constructor(private fb: FormBuilder, private trainingService: TrainingService,private evaluationService:EvaluationService) {}

  ngOnInit(): void {
    this.evaluationForm = this.fb.group({
      description: ['', Validators.required],
      evaluation_duration: ['', Validators.required],
      training_id: ['', Validators.required], // Updated to hold selected training
      score: ['', Validators.required],
      type: ['', Validators.required],
      questions: this.fb.array([])
    });

    this.loadTrainings(); // Load available trainings
  }

  // Load trainings from backend
  loadTrainings() {
    this.trainingService.gettrainings().subscribe({
      next: (data) => {
        this.trainings = data; // Store fetched trainings
      },
      error: (err) => console.error('Failed to load trainings', err)
    });
  }

  // Get questions array
  get questions(): FormArray {
    return this.evaluationForm.get('questions') as FormArray;
  }

  addQuestion() {
    this.questions.push(this.fb.group({
      question_text: ['', Validators.required],
      correct_answer: ['', Validators.required],
      options: this.fb.array([this.createOption(), this.createOption(), this.createOption()])
    }));
  }

  createOption(): FormGroup {
    return this.fb.group({
      option_text: ['', Validators.required]
    });
  }

  getOptionsControls(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  addOption(questionIndex: number) {
    this.getOptionsControls(questionIndex).push(this.createOption());
  }

  removeOption(questionIndex: number, optionIndex: number) {
    this.getOptionsControls(questionIndex).removeAt(optionIndex);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }
  onSubmit() {
    this.isSubmitted = true;
    this.successMessage = "Évaluation enregistrée avec succès !";
  
    const evaluationData = { ...this.evaluationForm.value };
  
    // Convert training_id to a Training object
    evaluationData.training = { idTraining: evaluationData.training_id }; 
    delete evaluationData.training_id; // Remove old ID field
  
    console.log("📤 Sending data:", JSON.stringify(evaluationData, null, 2)); // Debug JSON output
  
    this.evaluationService.addEvaluation(evaluationData).subscribe(response => {
      console.log('✅ Évaluation ajoutée avec succès:', response);
    }, error => {
      console.error("❌ Erreur lors de l'ajout de l'évaluation:", error);
    });
  }
  
  }