import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainingService } from 'src/app/Services/training.service';
import { Training, status, level } from 'src/app/models/Training';

@Component({
  selector: 'app-add-trainings',
  templateUrl: './add-trainings.component.html',
  styleUrls: ['./add-trainings.component.css']
})
export class AddTrainingsComponent implements OnInit {
  trainingForm!: FormGroup;
  Trainings: Training[] = [];
  selectedTraining: Training | null = null;
  statusOptions = Object.values(status);
  levelOptions = Object.values(level);

  constructor(private fb: FormBuilder, private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadTrainings();  // Load trainings when the component initializes
  }

  initializeForm(): void {
    this.trainingForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      trainingdate: ['', Validators.required],  // ✅ Date validator removed
      duration: ['', Validators.required],
      status: ['', Validators.required],
      level: ['', Validators.required]
    });
  }

  // Load trainings from the backend
  loadTrainings(): void {
    this.trainingService.gettrainings().subscribe(data => {
      this.Trainings = data;
    }, error => {
      console.error('Error loading trainings:', error);
    });
  }

  // Submit the form to add or update a training
  onSubmit(): void {
    if (this.trainingForm.valid) {
      const trainingData: Training = this.trainingForm.value;

      // ✅ Convert trainingdate to YYYY-MM-DD format
      trainingData.trainingdate = new Date(trainingData.trainingdate).toISOString().split('T')[0];

      console.log('Data being sent to backend:', JSON.stringify(trainingData, null, 2));

      if (this.selectedTraining) {
        trainingData.idTraining = this.selectedTraining.idTraining;
        this.modifyTraining(trainingData);
      } else {
        this.addTraining(trainingData);
      }
    }
  }

  // Add a new training
  addTraining(trainingData: Training): void {
    this.trainingService.addTraining(trainingData).subscribe(response => {
      console.log('Training added successfully:', response);
      this.Trainings.push(trainingData);
      this.trainingForm.reset();  // Reset the form after submission
    }, error => {
      console.error('Error adding training:', error);
    });
  }

  // Modify an existing training
  modifyTraining(trainingData: Training): void {
    this.trainingService.modifyTraining(trainingData).subscribe(response => {
      console.log('Training updated successfully:', response);
      this.loadTrainings();
      this.trainingForm.reset();
      this.selectedTraining = null;
    }, error => {
      console.error('Error updating training:', error);
    });
  }

  // Delete a training
  deleteTraining(trainingId: number): void {
    this.trainingService.deleteTraining(trainingId).subscribe(() => {
      console.log('Training deleted successfully');
      this.loadTrainings();  // Refresh the list after deletion
    }, error => {
      console.error('Error deleting training:', error);
    });
  }

  // Edit a training
  editTraining(training: Training): void {
    this.selectedTraining = training;
    this.trainingForm.patchValue({
      title: training.title,
      content: training.content,
      trainingdate: training.trainingdate,
      duration: training.duration,
      status: training.status,
      level: training.level
    });
  }
  // Modify an existing training
  addEvaluation(idTraining: number | undefined): void {
    window.open(`/ajoutEvaluation/${idTraining}`, '_blank');
  }


  // Close the form
  closeForm(): void {
    this.trainingForm.reset();
    this.selectedTraining = null;
  }
}
