import { Component } from '@angular/core';
import { Competition } from 'src/app/models/Competition';
import { CompetionService } from 'src/app/Services/competion.service';

@Component({
  selector: 'app-list-competition',
  templateUrl: './list-competition.component.html',
  styleUrls: ['./list-competition.component.css']
})
export class ListCompetitionComponent {
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
   editCompetition(competition: any) {
    // Logic to edit a competition
  }

  deleteCompetition(id: number) {
    if (confirm('Are you sure you want to delete this competition?')) {
     /* this.competionService.deleteCompetition(id).subscribe(() => {
        this.refresh();
      });*/
    }
  }
}
