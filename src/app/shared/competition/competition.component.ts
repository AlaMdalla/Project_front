import { Component } from '@angular/core';
import { Competition } from 'src/app/models/Competition';
import { CompetionService } from 'src/app/Services/competion.service';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.css']
})
export class CompetitionComponent {
  constructor(private competionService:CompetionService){}
  competitions: Competition[] =[];
  refrech():void{
    this.competionService.getCompetitions().subscribe(data =>
      {this.competitions=data;}
      );
  }
  ngOnInit(): void {
    this.refrech();
  
   }
}
