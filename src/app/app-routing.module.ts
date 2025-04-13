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
import { AddTrainingsComponent } from "./admin/Trainings/add-trainings/add-trainings.component";
import { CandidatListComponent } from "./shared/Candidats/candidat-list/candidat-list.component";
import { JobListComponent } from "./shared/Job/job-list/job-list.component";
import { JobFormComponent } from "./shared/Job/job-form/job-form.component";
import { LoginComponent } from "./shared/login/login.component";
import { RegisterComponent } from "./shared/register/register.component";
import { adminGuard, usersGuard } from "./Services/users.guard";
import { ProfileComponent } from "./shared/profile/profile.component";
import { UpdateuserComponent } from "./shared/updateuser/updateuser.component";
import { UsersListComponent } from "./admin/users-list/users-list.component";
import { SubsCreateComponentComponent } from "./admin/Subs/subs-create-component/subs-create-component.component";
import { SubUpdateComponent } from "./admin/Subs/sub-update/sub-update.component";
import { UpdatePostComponent } from "./shared/blog/update-post/update-post.component";
import { ReclamationComponent } from "./shared/blog/reclamation/reclamation.component";
import { ListereclamationComponent } from "./admin/blog/listereclamation/listereclamation.component";
import { AjoutEvaluationComponent } from "./admin/Trainings/ajout-evaluation/ajout-evaluation.component";
import { TrainingDetailComponent } from "./training-detail/training-detail.component";
import { EvaluationDetailsComponent } from "./shared/evaluation-details/evaluation-details.component";
import { CandidateFormComponent } from "./shared/Candidats/candidat-form/candidat-form.component";
import { ApplyJobComponent } from "./shared/apply-job/apply-job.component";

const routes: Routes = [
    {path : "Problems",component:ListProblemComponent},
    {path :"Competition",component:CompetitionsComponent},
    {path : "courses",component:CoursesComponent},
    {path : "problemSubmission/:id",component:ProblemSubmitionComponent},
    {path: 'Posts' , component: ViewAllComponent},
    {path : "Competition/:id",component:CompetionComponent},
    {path : "",component:HomeComponent},
    {path: 'addPost' , component: AddPostComponent},
    {path: 'addtraining' , component: AddTrainingsComponent},
    { path: 'problem/edit/:id', component: AddProblemComponent },
    { path: 'reclamation/:id', component: ReclamationComponent },
    { path: 'reclamations', component: ListereclamationComponent },
    { path: 'evaluation/:id', component: EvaluationDetailsComponent },

    {path: 'addProblem' , component: AddProblemComponent},
    {path: 'addCompetition' , component: AddCompetitionComponent},
    { path: 'Competition/edit/:id', component: AddCompetitionComponent },
    { path: 'addSubs', component: SubsCreateComponentComponent,canActivate:[adminGuard] },
    { path: 'updateSubs/:id', component: SubUpdateComponent,canActivate:[adminGuard] },
    { path: 'ajoutEvaluation', component: AjoutEvaluationComponent },
    { path: 'addTraining', component: AddTrainingsComponent },
    { path: 'training-detail/:id', component: TrainingDetailComponent },
    { path: 'update-post/:id', component: UpdatePostComponent },

    {path: 'view-post/:id' , component: ViewPostComponent},
    {path: 'admin' , component: HomeAdminComponent ,},
    //candidate routes
    { path: 'jobs', component: JobListComponent },
    { path: 'jobs/new', component: JobFormComponent },

    { path: 'jobs/edit/:id', component: JobFormComponent },
    { path: 'candidates', component: CandidatListComponent },
    { path: 'candidates/new', component: CandidateFormComponent },
    { path: 'candidates/new/:id', component: ApplyJobComponent },

    { path: 'candidates/edit/:id', component: CandidateFormComponent },
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'profile', component: ProfileComponent, canActivate: [usersGuard]},
    {path: 'update/:id', component: UpdateuserComponent, canActivate: [usersGuard]},
   {path: 'users', component: UsersListComponent, canActivate:[adminGuard]},
    {path: '**', component: LoginComponent},
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    { path: '**', redirectTo: '' } 



]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  
  export class AppRoutingModule { 
  
  }