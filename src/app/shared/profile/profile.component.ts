import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Problem } from 'src/app/models/Problem';
import { PoblemService } from 'src/app/Services/poblem.service';
import { SubmitionService } from 'src/app/Services/submition.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  passedProblems: String[] = [];
  submissions:any[] =[];
  problemTitle!:string;
  constructor(private readonly userService:UsersService,private problemsS:PoblemService, private submitionService:SubmitionService,
    private readonly router: Router){}


    profileInfo: any;
    errorMessage: string = ''

  async ngOnInit() {

    try {
      const token = localStorage.getItem('token')
      if(!token){
        throw new Error("No Token Found")
      }

      this.profileInfo = await this.userService.getYourProfile(token);
     
    } catch (error:any) {
      this.showError(error.message)
    }
      this.problemsS.getPassedProblems(this.profileInfo.ourUsers.id).subscribe(data => {
            this.passedProblems = data;})
            this.submitionService.getSubmitionsByUser(this.profileInfo.ourUsers.id).subscribe(data => {
              this.submissions = data;
              console.log(this.submissions)}
             
            )
  }


  updateProfile(id: string){
      this.router.navigate(['/update', id])
  }

  getTitle(id:number):string{
    this.submitionService.getProblemTitle(id).subscribe(data =>
      {this.problemTitle=data;
      }
      );
      return this.problemTitle;
  }
  showError(mess: string) {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = ''
    }, 3000)
  }
}
