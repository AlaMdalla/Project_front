import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import { TrainingService } from 'src/app/Services/training.service';
import { Training } from 'src/app/models/Training';
import { Evaluation } from '../models/Evaluation';
import { EvaluationService } from '../Services/evaluation.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    HttpClientModule
  ],
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  trainingId: number = 0;
  course: Training | null = null;

  constructor(
    private route: ActivatedRoute,
    private trainingService: TrainingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.trainingId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.trainingId) {
      this.getCourseDetails(this.trainingId); // Charger les détails du cours
    }
  }

  // Charger les détails du cours
  getCourseDetails(id: number): void {
    this.trainingService.getTrainingById(id).subscribe({
      next: (data: Training) => {
        console.log('Détails du cours reçus :', data); // Debugging
        this.course = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails du cours', error);
      }
    });
  }

  // Naviguer vers la page des évaluations associées au cours
  goToEvaluations(): void {
    this.router.navigate([`/evaluations/${this.trainingId}`]);
  }
}