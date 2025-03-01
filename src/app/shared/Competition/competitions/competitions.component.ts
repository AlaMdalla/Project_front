import { Component } from '@angular/core';
import { Competition } from 'src/app/models/Competition';
import { CompetionService } from 'src/app/Services/competion.service';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.css']
})
export class CompetitionsComponent {
  constructor(private competionService:CompetionService){}
  competitions: Competition[] =[];
  isLightMode = true;
  isLoading = true;
  refrech():void{
    this.competionService.getCompetitions().subscribe(data =>
      {this.competitions=data;}
      );
  }
  ngOnInit(): void {
    this.refrech();
  
   }
}
