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
  displayedCompetitions: Competition[] = []; // Subset of competitions to display
  currentPage: number = 1; 
  pageSize: number = 2; 
  totalItems: number = 0; 
  totalPages: number = 0; 
  refrech(): void {
    this.competionService.getCompetitions().subscribe(data => {
      this.competitions = data;
      this.totalItems = data.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.displayedCompetitions = this.competitions.slice(start, end);
    });
  }
  ngOnInit(): void {
    this.refrech();
  
   }
   editCompetition(competition: any) {
    // Logic to edit a competition
  }

  deleteCompetition(id: number) {
    if (confirm('Are you sure you want to delete this competition?')) {
      this.competionService.deleteCompetitionById(id).subscribe(
        res => {
          console.log("res", res);
          this.competitions = this.competitions.filter(c => c.id !== id);
          this.totalItems = this.competitions.length;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          if (this.displayedCompetitions.length === 1 && this.currentPage > 1) {
            this.currentPage--;
          }
          this.refrech();
        },
        error => {
          console.error(error);
        }
      );
    }
  }
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.refrech();
    }
  }
  
}
