import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainingService } from 'src/app/Services/training.service';
import { Training } from 'src/app/models/Training';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  courseId: number = 0;
  course: Training | undefined;
  safeVideoUrl: SafeResourceUrl | undefined;

  constructor(
    private route: ActivatedRoute,
    private trainingService: TrainingService,
    private sanitizer: DomSanitizer

  ) {}
  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    console.log("Course ID retrieved:", this.courseId);

    if (this.courseId) {
      this.getCourseDetails(this.courseId);
    } else {
      console.error("Invalid course ID");
    }
  }

  getCourseDetails(id: number): void {
    this.trainingService.getTrainingById(id).subscribe(
      (data: Training) => {
        console.log("Course details received:", data);
        this.course = data;

        // Sécuriser l'URL de la vidéo (YouTube, Drive, etc.)
        if (this.course.videoUrl) {
          this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.course.videoUrl);
        }
      },
      (error) => {
        console.error('Error fetching course details:', error);
      }
    );
  }
}
