import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Problem } from 'src/app/models/Problem';
import { PoblemService } from 'src/app/Services/poblem.service';

@Component({
  selector: 'app-list-problems',
  templateUrl: './list-problems.component.html',
  styleUrls: ['./list-problems.component.css']
})
export class ListProblemsComponent {



constructor(private problemsS:PoblemService,private router:Router){}
editProblem(id: number) {
  this.router.navigate(['/problem/edit', id]);}

problems: Problem[]=[];
displayedProblems: Problem[] = []; 
  currentPage: number = 1; 
  pageSize: number = 2; 
  totalItems: number = 0; 
  totalPages: number = 0; 
ngOnInit(): void {
  this.refrech();

 }
refrech():void{
  this.problemsS.getProblems().subscribe(data =>
    {this.problems=data;
      this.totalItems = data.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.displayedProblems = this.problems.slice(start, end);
    }
    );
}
deleteProblem(id: number) {
  if (confirm('Are you sure you want to delete this competition?')) {
    this.problemsS.deleteProblemById(id).subscribe(
      res => {
        console.log("res", res);
        this.problems = this.problems.filter(c => c.id !== id);
        this.totalItems = this.problems.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        if (this.displayedProblems.length === 1 && this.currentPage > 1) {
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
