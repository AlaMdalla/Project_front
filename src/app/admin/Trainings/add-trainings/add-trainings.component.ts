import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvaluationService } from 'src/app/Services/evaluation.service';
import { TrainingService } from 'src/app/Services/training.service';
import { Training, status, level } from 'src/app/models/Training';

@Component({
  selector: 'app-add-trainings',
  templateUrl: './add-trainings.component.html',
  styleUrls: ['./add-trainings.component.css']
})
export class AddTrainingsComponent implements OnInit {
  evaluationForm!: FormGroup;

  constructor(private fb: FormBuilder, private evaluationService: EvaluationService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.evaluationForm = this.fb.group({
      trainingId: ['', Validators.required], // Assuming you link to a Training
      description: ['', Validators.required],
      type: ['', Validators.required],
      evaluation_duration: ['', Validators.required],
      score: [0, Validators.required],
      createdAt: [new Date().toISOString().split('T')[0], Validators.required],
      certificat: [false],
      questions: this.fb.array([]) // FormArray for dynamic questions
    });
  }

  // Getter for questions FormArray
  get questions(): FormArray {
    return this.evaluationForm.get('questions') as FormArray;
  }

  // Add a new question to the FormArray
  addQuestion(): void {
    const questionForm = this.fb.group({
      questionText: ['', Validators.required],
      response: ['', Validators.required]
    });
    this.questions.push(questionForm);
  }

  // Remove a question
  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  onSubmit(): void {
    if (this.evaluationForm.valid) {
      const evaluationData = this.evaluationForm.value;

      // Ensure training is correctly formatted (assuming it’s just an ID)
      evaluationData.training = { idTraining: evaluationData.trainingId };
      delete evaluationData.trainingId; // Remove temporary field

      console.log('Data being sent to backend:', JSON.stringify(evaluationData, null, 2));

      this.evaluationService.addEvaluation(evaluationData).subscribe(
        response => {
          console.log('Evaluation added successfully:', response);
          this.evaluationForm.reset();
          this.questions.clear();
        },
        error => {
          console.error('Error adding evaluation:', error);
        }
      );
    }
  }
}
