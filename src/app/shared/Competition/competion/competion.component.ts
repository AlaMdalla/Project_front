import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Competition } from 'src/app/models/Competition';
import { Problem } from 'src/app/models/Problem';
import { CompetionService } from 'src/app/Services/competion.service';

@Component({
  selector: 'app-competion',
  templateUrl: './competion.component.html',
  styleUrls: ['./competion.component.css']
})
export class CompetionComponent {
  competionId? :number|null =null
  problems?:Problem[];
  competition? :Competition
  constructor(private route: ActivatedRoute,private competionService :CompetionService) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
     this.competionId = id ? +id : null; 
   
     console.log('Problem ID:', this.competionId); 
     this.get(this.competionId!);
   }
   get(id:number):void{
    this.competionService.getCompetition(id).subscribe(data =>
      {this.competition=data;
        this.problems=this.competition.problems;
        console.log("competition",this.competition.id)
      }
      );
  }
}