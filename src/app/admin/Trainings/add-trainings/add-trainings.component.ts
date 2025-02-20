import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Training } from 'src/app/models/Training';
import { TrainingService } from 'src/app/Services/training.service';

@Component({
  selector: 'app-add-trainings',
  templateUrl: './add-trainings.component.html',
  styleUrls: ['./add-trainings.component.css']
})
export class AddTrainingsComponent {
  trainingForm!: FormGroup;
  levelOptions = "" //Object.values(Level); // Get the string values of the enum

  constructor(private fb: FormBuilder, private trainingService: TrainingService) {
    this.trainingForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      trainingdate: ['', Validators.required],
      level: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.trainingForm.valid) {
      const trainingData = this.trainingForm.value;
     // trainingData.level = Level[trainingData.level as keyof typeof Level]; // Convert string to enum
     // this.trainingService.addTraining(trainingData); // Use the service to add the training
      this.trainingForm.reset(); // Clear the form after submission
    }
  }
  Trainings :Training[]=[]
  
  
    ngOnInit(): void {
      this.refrech();
    
     }
    refrech():void{
      this.trainingService.gettrainings().subscribe(data =>
        {this.Trainings=data;}
        );
    }

}
