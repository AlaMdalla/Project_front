import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';
import { ListProblemComponent } from "./shared/Problems/list-problem/list-problem.component";
import { ProblemSubmitionComponent } from "./shared/Problems/problem-submition/problem-submition.component";
import { HomeComponent } from "./shared/home/home.component";
import { CoursesComponent } from "./shared/courses/courses.component";

const routes: Routes = [
    {path : "Problems",component:ListProblemComponent},
    {path : "courses",component:CoursesComponent},

    {path : "problemSubmission/:id",component:ProblemSubmitionComponent},
    {path : "",component:HomeComponent},


]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  
  export class AppRoutingModule { 
  
  }