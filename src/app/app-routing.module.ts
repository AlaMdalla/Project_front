import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';
import { ListProblemComponent } from "./shared/Problems/list-problem/list-problem.component";
import { ProblemSubmitionComponent } from "./shared/Problems/problem-submition/problem-submition.component";
import { HomeComponent } from "./shared/home/home.component";
import { CoursesComponent } from "./shared/courses/courses.component";
import { CompetionComponent } from "./shared/Competion/competion/competion.component";
import { AddPostComponent } from "./shared/blog/add-post/add-post.component";
import { ViewAllComponent } from "./shared/blog/view-all/view-all.component";
import { ViewPostComponent } from "./shared/blog/view-post/view-post.component";
import {EvaluationComponent} from "./shared/evaluation/evaluation.component";
import {BrowserModule} from "@angular/platform-browser";
import {AddEvaluationComponent} from "./add-evaluation/add-evaluation.component";

const routes: Routes = [
    {path : "Problems",component:ListProblemComponent},
    {path : "courses",component:CoursesComponent},
  { path: 'evaluations', component: EvaluationComponent },
  { path: 'evaluations/add', component: AddEvaluationComponent },
  {path: 'admin' , component: HomeComponent},
  {path : "problemSubmission/:id",component:ProblemSubmitionComponent},
    {path: 'Posts' , component: ViewAllComponent},
    {path : "Competition/:id",component:CompetionComponent},
    {path : "",component:HomeComponent},
    {path: 'addPost' , component: AddPostComponent},
    {path: 'view-post/:id' , component: ViewPostComponent}


]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
  //imports: [BrowserModule, AppRoutingModule, EvaluationsModule],
  exports: [RouterModule]
  })

  export class AppRoutingModule {

  }
