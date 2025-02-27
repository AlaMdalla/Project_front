import { Component } from '@angular/core';
import { Training } from 'src/app/models/Training';
import { TrainingService } from 'src/app/Services/training.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {
  courses :Training[]=[]

  constructor(private trainingService:TrainingService) { }

  ngOnInit(): void {
    // Récupération des formations depuis le backend via le service
    this.trainingService.gettrainings().subscribe(
      (data: Training[]) => {
        this.courses = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des formations :', error);
      }
    );
  }
}
