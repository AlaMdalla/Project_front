import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Problem } from 'src/app/models/Problem';
import { PoblemService } from 'src/app/Services/poblem.service';
import { SubmitionService } from 'src/app/Services/submition.service';

@Component({
  selector: 'app-problem-submition',
  templateUrl: './problem-submition.component.html',
  styleUrls: ['./problem-submition.component.css']
})
export class ProblemSubmitionComponent {
problemId? :number|null =null
problem? :Problem
solutionCode: string = '';
output : string ='';
constructor(private route: ActivatedRoute,private problemsS :PoblemService,private submitionService:SubmitionService) {}
ngOnInit(): void {
 const id = this.route.snapshot.paramMap.get('id');
 
  this.problemId = id ? +id : null; 

  console.log('Problem ID:', this.problemId); 
  this.get(this.problemId!);
}
get(id:number):void{
  this.problemsS.getProblem(id).subscribe(data =>
    {this.problem=data;
      console.log("problem",this.problem.description)
    }
    );
}
submit(code:string):void{
  this.submitionService.submitSolution(this.problem?.id, code).subscribe(data => {
    this.output = data; 
  });
  
   
}

}
