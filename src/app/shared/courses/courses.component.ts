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
    this.refrech();

   }

  openTrainingDetails(id: number | undefined): void {
    window.open(`/training-detail/${id}`, '_blank');
  }
  refrech():void{
    this.trainingService.gettrainings().subscribe(data =>
      {this.courses=data;}
      );
  }
}
