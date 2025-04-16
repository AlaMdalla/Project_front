import { Component } from '@angular/core';
import { Training } from 'src/app/models/Training';
import { TrainingService } from 'src/app/Services/training.service';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {
  courses :Training[]=[]
  filteredCourses: Training[] = [];
  searchTerm: string = '';


  constructor(private trainingService:TrainingService,private translate: TranslateService) { }

  ngOnInit(): void {
    this.refrech();
    console.log('Langue initiale :', this.translate.currentLang);

    this.translate.onLangChange.subscribe((event) => {
      console.log('Langue changée :', event.lang);
    });

   }

  openTrainingDetails(id: number | undefined): void {
    window.open(`/training-detail/${id}`, '_blank');
  }
  refrech():void{
    this.trainingService.gettrainings().subscribe(data =>
      {this.courses=data;}
      );
  }
  refresh(): void {
    this.trainingService.gettrainings().subscribe(data => {
      this.courses = data;
      this.filteredCourses = data;
    });
  }

  filterCourses(): void {
    this.filteredCourses = this.courses.filter(course =>
      course.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

}
