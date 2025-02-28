import { Component, HostListener } from '@angular/core';
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
fullS:boolean=false
solutionCode: string = '';
output : string ='';
constructor(private route: ActivatedRoute,private problemsS :PoblemService,private submitionService:SubmitionService) {}
ngOnInit(): void {
 const id = this.route.snapshot.paramMap.get('id');
 
  this.problemId = id ? +id : null; 

  console.log('Problem ID:', this.problemId); 
  this.get(this.problemId!);
  this.enterFullScreen();
  
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

@HostListener('document:contextmenu', ['$event'])
disableRightClick(event: MouseEvent) {
  event.preventDefault(); // Prevent right-click menu
}

@HostListener('document:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {
  // Disable opening new tabs via Ctrl+T or Ctrl+N
  if (event.ctrlKey && (event.key === 't' || event.key === 'n')) {
    event.preventDefault();
  }

  // Disable navigating back or forward using the browser's back and forward buttons
  if (event.key === 'Backspace' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
  }
}



enterFullScreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if ((elem as any).mozRequestFullScreen) {
    (elem as any).mozRequestFullScreen();
  } else if ((elem as any).webkitRequestFullscreen) {
    (elem as any).webkitRequestFullscreen();
  } else if ((elem as any).msRequestFullscreen) {
    (elem as any).msRequestFullscreen();
  }
  
}

exitFullScreen() {
  this.fullS=false
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if ((document as any).mozCancelFullScreen) {
    (document as any).mozCancelFullScreen();
  } else if ((document as any).webkitExitFullscreen) {
    (document as any).webkitExitFullscreen();
  } else if ((document as any).msExitFullscreen) {
    (document as any).msExitFullscreen();
  }
}
}
