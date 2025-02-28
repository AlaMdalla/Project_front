import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';
import { ListProblemComponent } from "./shared/Problems/list-problem/list-problem.component";
import { ProblemSubmitionComponent } from "./shared/Problems/problem-submition/problem-submition.component";
import { HomeComponent } from "./shared/home/home.component";
import { CoursesComponent } from "./shared/courses/courses.component";
import { AddPostComponent } from "./shared/blog/add-post/add-post.component";
import { ViewAllComponent } from "./shared/blog/view-all/view-all.component";
import { ViewPostComponent } from "./shared/blog/view-post/view-post.component";
import { HomeAdminComponent } from "./admin/home-admin/home-admin.component";
import { AddProblemComponent } from "./admin/add-problem/add-problem.component";
import { CompetionComponent } from "./shared/Competition/competion/competion.component";
import { CompetitionsComponent } from "./shared/Competition/competitions/competitions.component";
import { AddCompetitionComponent } from "./admin/Competition/add-competition/add-competition.component";
import { AddTrainingsComponent } from "./admin/Trainings/add-trainings/add-trainings.component"; // Make sure path is correct
import { CandidatListComponent } from "./shared/Candidats/candidat-list/candidat-list.component";
import { CandidatFormComponent } from "./shared/Candidats/candidat-form/candidat-form.component";
import { JobListComponent } from "./shared/Job/job-list/job-list.component";
import { JobFormComponent } from "./shared/Job/job-form/job-form.component";
import {EvaluationComponent} from "./shared/evaluation/evaluation.component";

const routes: Routes = [
  { path: "Problems", component: ListProblemComponent },
  { path: "Competition", component: CompetitionsComponent },
  { path: "courses", component: CoursesComponent },
  { path: "evaluations", component:EvaluationComponent },
  { path: "problemSubmission/:id", component: ProblemSubmitionComponent },
  { path: 'Posts', component: ViewAllComponent },
  { path: "Competition/:id", component: CompetionComponent },
  { path: "", component: HomeComponent },
  { path: 'addPost', component: AddPostComponent },
  { path: 'add-trainings', component: AddTrainingsComponent },

  { path: 'addProblem', component: AddProblemComponent },
  { path: 'addCompetition', component: AddCompetitionComponent },
  { path: 'view-post/:id', component: ViewPostComponent },
  { path: 'admin', component: HomeAdminComponent },

  // candidate routes
  { path: 'jobs', component: JobListComponent },
  { path: 'jobs/new', component: JobFormComponent },
  { path: 'jobs/edit/:id', component: JobFormComponent },
  { path: 'candidates', component: CandidatListComponent },
  { path: 'candidates/new', component: CandidatFormComponent },
  { path: 'candidates/edit/:id', component: CandidatFormComponent },

  // wildcard route for undefined paths
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
