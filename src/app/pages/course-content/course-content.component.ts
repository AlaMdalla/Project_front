import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainingService } from 'src/app/Services/training.service';
import { Training } from 'src/app/models/Training';

@Component({
  selector: 'app-course-content',
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.css']
})
export class CourseContentComponent implements OnInit {
  trainingId!: number;
  training: Training | null = null;
  formattedContent: string[] = [];
  pageSize = 10; // nombre de lignes par page
  currentPage = 1;

  constructor(private route: ActivatedRoute, private trainingService: TrainingService) {}

  get paginatedContent(): string[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.formattedContent.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.formattedContent.length / this.pageSize);
  }

  ngOnInit(): void {
    this.trainingId = +this.route.snapshot.paramMap.get('id')!;
    this.trainingService.getTrainingById(this.trainingId).subscribe((data: Training) => {
      this.training = data;

      // ✅ Ne traite le contenu que quand les données sont disponibles
      if (this.training?.content) {
        this.formattedContent = this.training.content
          .split(/[◆•●\n\.]/) // ou /[•◆\n\.]/ selon les séparateurs
          .map(line => line.trim())
          .filter(line => line.length > 0);
      }
    });
}}
