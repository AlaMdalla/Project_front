// src/app/app-routing.module.tscourse-content
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Shared components
import { ListProblemComponent } from './shared/Problems/list-problem/list-problem.component';
import { ProblemSubmitionComponent } from './shared/Problems/problem-submition/problem-submition.component';
import { HomeComponent } from './shared/home/home.component';
import { CoursesComponent } from './shared/courses/courses.component';
import { AddPostComponent } from './shared/blog/add-post/add-post.component';
import { ViewAllComponent } from './shared/blog/view-all/view-all.component';
import { ViewPostComponent } from './shared/blog/view-post/view-post.component';
import { UpdatePostComponent } from './shared/blog/update-post/update-post.component';
import { ReclamationComponent } from './shared/blog/reclamation/reclamation.component';
import { CandidatListComponent } from './shared/Candidats/candidat-list/candidat-list.component';
import { CandidateFormComponent } from './shared/Candidats/candidat-form/candidat-form.component';
import { JobListComponent } from './shared/Job/job-list/job-list.component';
import { JobFormComponent } from './shared/Job/job-form/job-form.component';
import { LoginComponent } from './shared/login/login.component';
import { RegisterComponent } from './shared/register/register.component';
import { ProfileComponent } from './shared/profile/profile.component';
import { UpdateuserComponent } from './shared/updateuser/updateuser.component';
import { UserSubscriptionViewComponent } from './shared/user-subscription-view/user-subscription-view.component';
import { SubscriptionFormComponent } from './shared/subscription-form/subscription-form.component';
import { PaymentComponent } from './shared/payment/payment.component';
import { SuccessComponent } from './shared/success/success.component';
import { ErrorComponent } from './shared/error/error.component';
import { ApplyJobComponent } from './shared/apply-job/apply-job.component';
import { EvaluationComponent } from './shared/evaluation-details/evaluation-details.component';

// Admin components
import { HomeAdminComponent } from './admin/home-admin/home-admin.component';
import { AddProblemComponent } from './admin/add-problem/add-problem.component';
import { AddCompetitionComponent } from './admin/Competition/add-competition/add-competition.component';
import { AddTrainingsComponent } from './admin/Trainings/add-trainings/add-trainings.component';
import { SubsCreateComponentComponent } from './admin/Subs/subs-create-component/subs-create-component.component';
import { SubUpdateComponent } from './admin/Subs/sub-update/sub-update.component';
import { UsersListComponent } from './admin/users-list/users-list.component';
import { AjoutEvaluationComponent } from './admin/Trainings/ajout-evaluation/ajout-evaluation.component';
import { ListereclamationComponent } from './admin/blog/listereclamation/listereclamation.component';

// Competition
import { CompetionComponent } from './shared/Competition/competion/competion.component';
import { CompetitionsComponent } from './shared/Competition/competitions/competitions.component';

// Training & Quiz
import { TrainingDetailComponent } from './training-detail/training-detail.component';
import { QuizFailedComponent } from './quiz-failed/quiz-failed.component';
import { CourseContentComponent } from './pages/course-content/course-content.component';

// Chat
import { ChatComponent } from './chat/chat.component';

// Guards
import { adminGuard, usersGuard } from './Services/users.guard';
import { ResetPasswordComponent } from './shared/reset-password/reset-password.component';
import { SimpleUserRegisterComponent } from './shared/simple-user-register/simple-user-register.component';
import { ForgotPasswordComponentComponent } from './shared/forgot-password/forgot-password.component';
import { ListjobsadminComponent } from './shared/listjobsadmin/listjobsadmin.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'reset-password :email', component: ResetPasswordComponent },

  { path: 'Problems', component: ListProblemComponent },
  { path: 'problemSubmission/:id', component: ProblemSubmitionComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'Posts', component: ViewAllComponent },
  { path: 'addPost', component: AddPostComponent },
  { path: 'update-post/:id', component: UpdatePostComponent },
  { path: 'view-post/:id', component: ViewPostComponent },
  { path: 'reclamation/:id', component: ReclamationComponent },
  { path: 'reclamations', component: ListereclamationComponent },
  { path: 'Competition', component: CompetitionsComponent },
  { path: 'Competition/:id', component: CompetionComponent },
  { path: 'Competition/edit/:id', component: AddCompetitionComponent },
  { path: 'addCompetition', component: AddCompetitionComponent },
  { path: 'addProblem', component: AddProblemComponent },
  { path: 'problem/edit/:id', component: AddProblemComponent },
  { path: 'addtraining', component: AddTrainingsComponent },
  { path: 'ajoutEvaluation', component: AjoutEvaluationComponent },
  { path: 'ajoutEvaluation/:id', component: AjoutEvaluationComponent },
  { path: 'evaluation/:id', component: EvaluationComponent },
  { path: 'training-detail/:id', component: TrainingDetailComponent },
  { path: 'course-content/:id', component: CourseContentComponent },
  { path: 'quiz-failed', component: QuizFailedComponent },
  { path: 'jobs', component: JobListComponent },
  { path: 'jobs/new', component: JobFormComponent },
  { path: 'jobs/edit/:id', component: JobFormComponent },
  { path: 'candidates', component: CandidatListComponent },
  { path: 'candidates/new', component: CandidateFormComponent },
  { path: 'candidates/edit/:id', component: CandidateFormComponent },
  { path: 'candidates/new/:id', component: ApplyJobComponent },
  { path: 'subscriptions', component: UserSubscriptionViewComponent },
  { path: 'add', component: SubscriptionFormComponent },
  { path: 'edit/:id', component: SubscriptionFormComponent },
  { path: 'payment/:subid', component: PaymentComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'chat', component: ChatComponent, canActivate: [usersGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [usersGuard] },
  { path: 'update/:id', component: UpdateuserComponent, canActivate: [usersGuard] },
  { path: 'users', component: UsersListComponent, canActivate: [adminGuard] },
  { path: 'admin', component: HomeAdminComponent, canActivate: [adminGuard] },
  { path: 'addSubs', component: SubsCreateComponentComponent, canActivate: [adminGuard] },
  { path: 'updateSubs/:id', component: SubUpdateComponent, canActivate: [adminGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'reset-password/:email', component: ResetPasswordComponent },
    {path: 'UserRegister', component: SimpleUserRegisterComponent},
    { path: 'forgot-password', component: ForgotPasswordComponentComponent },
    { path: 'jobadmin', component: ListjobsadminComponent },

  { path: '**', component: LoginComponent } // Wildcard route for 404

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
