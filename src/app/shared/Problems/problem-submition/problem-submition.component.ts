import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { env } from 'src/app/env/api';
import { Problem } from 'src/app/models/Problem';
import { PoblemService } from 'src/app/Services/poblem.service';
import { SubmitionService } from 'src/app/Services/submition.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-problem-submition',
  templateUrl: './problem-submition.component.html',
  styleUrls: ['./problem-submition.component.css']
})
export class ProblemSubmitionComponent {
problemId? :number|null =null
userId? :number|0;
profileInfo: any;
  private copApi = env.copApi; 

problem? :Problem
fullS:boolean=false
solutionCode: string = '';
output : string ='';
//code copilottttttttt 
suggestion: string = '';
typingTimeout: any;
onCodeChange(): void {
  clearTimeout(this.typingTimeout);
  this.typingTimeout = setTimeout(() => {
    this.getSuggestion();
  }, 1000); // Wait 1 second after user stops typing
}
constructor(private route: ActivatedRoute,private problemsS :PoblemService,private submitionService:SubmitionService,private usersService:UsersService) {}
  async ngOnInit(): Promise<void> {
 const id = this.route.snapshot.paramMap.get('id');
 
  this.problemId = id ? +id : null; 

  console.log('Problem ID:', this.problemId); 
  this.get(this.problemId!);
  this.enterFullScreen();
  try {
    const token = localStorage.getItem('token')
    if(!token){
      throw new Error("No Token Found")
    }

    this.profileInfo = await this.usersService.getYourProfile(token);
    console.log(this.profileInfo)
    this.userId=this.profileInfo.ourUsers.id;
   
  } catch (error:any) {
    console.log(error.message)
  }
    
  
}
get(id:number):void{
  this.problemsS.getProblem(id).subscribe(data =>
    {this.problem=data;
      console.log("problem",this.problem.description)
    }
    );
}
submit(code:string):void{
  this.submitionService.submitSolution(this.userId!,this.problem?.id, code).subscribe(data => {
    this.output = data; 
  });
  
   
}
/*
@HostListener('document:contextmenu', ['$event'])
disableRightClick(event: MouseEvent) {
  event.preventDefault(); // Prevent right-click menu
}

@HostListener('document:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {
  // Disable opening new tabs via Ctrl+T or Ctrl+N
  if (event.ctrlKey && (event.key === 'c' || event.key === 'v')) {
    event.preventDefault();
  }

  // Disable navigating back or forward using the browser's back and forward buttons
  if (event.key === 'Backspace' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
  }
}

*/

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
async getSuggestion(): Promise<void> {
  try {
    console.log("dkhallll")
        const response = await fetch('https://api-inference.huggingface.co/models/bigcode/starcoder', {
      method: 'POST',
      headers: {
        'Authorization': this.copApi,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: this.solutionCode
      })
    });

    if (!response.ok) {
      this.suggestion = `❌ API error: ${response.status} ${response.statusText}`;
      console.error(await response.text());
      return;
    }

    const result = await response.json();
    console.log('✅ API Response:', result);

    this.suggestion = result?.[0]?.generated_text || '⚠️ No suggestion found.';
  } catch (error) {
    console.error('❌ Exception:', error);
    this.suggestion = `❌ Connection failed: ${error}`;
  }
}

}
