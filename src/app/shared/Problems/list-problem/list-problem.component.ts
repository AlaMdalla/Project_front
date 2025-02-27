import { Component } from '@angular/core';
import { Problem } from 'src/app/models/Problem';
import { PoblemService } from 'src/app/Services/poblem.service';

@Component({
  selector: 'app-list-problem',
  templateUrl: './list-problem.component.html',
  styleUrls: ['./list-problem.component.css']
})
export class ListProblemComponent {
deleteProblem(arg0: number) {
throw new Error('Method not implemented.');
}
constructor(private problemsS:PoblemService){}
problems: Problem[]=[];
ngOnInit(): void {
  this.refrech();

 }
refrech():void{
  this.problemsS.getProblems().subscribe(data =>
    {this.problems=data;}
    );
}
delete(id:number):void{
  this.problemsS.deleteProblem(id).subscribe(data =>
    
    {
      
      this.problems=data;
      window.location.reload(); 

      
    }
    );
 
}

}
