import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ListProblemComponent } from './shared/Problems/list-problem/list-problem.component';
import { ProblemSubmitionComponent } from './shared/Problems/problem-submition/problem-submition.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './shared/home/home.component';
import { CoursesComponent } from './shared/courses/courses.component';
import { CompetionComponent } from './shared/Competition/competion/competion.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { AddPostComponent } from './shared/blog/add-post/add-post.component';
import { ViewAllComponent } from './shared/blog/view-all/view-all.component';
import { ViewPostComponent } from './shared/blog/view-post/view-post.component';
import { HomeAdminComponent } from './admin/home-admin/home-admin.component';
import { AddProblemComponent } from './admin/add-problem/add-problem.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { CompetitionsComponent } from './shared/Competition/competitions/competitions.component';
import { AddCompetitionComponent } from './admin/Competition/add-competition/add-competition.component';
import { ListCompetitionComponent } from './admin/Competition/list-competition/list-competition.component';
import { AddTrainingsComponent } from './admin/Trainings/add-trainings/add-trainings.component';
import { CandidatListComponent } from './shared/Candidats/candidat-list/candidat-list.component';
import { JobListComponent } from './shared/Job/job-list/job-list.component';
import { JobFormComponent } from './shared/Job/job-form/job-form.component';
import { ListProblemsComponent } from './admin/Problems/list-problems/list-problems.component';
import { UsersListComponent } from './admin/users-list/users-list.component';
import { SubsCreateComponentComponent } from './admin/Subs/subs-create-component/subs-create-component.component';
import { SubsListComponent } from './admin/Subs/subs-list/subs-list.component';
import { SubsComponent } from './shared/Subs/subs/subs.component';
import { SubUpdateComponent } from './admin/Subs/sub-update/sub-update.component';
import { ListereclamationComponent } from './admin/blog/listereclamation/listereclamation.component';
import { ReclamationComponent } from './shared/blog/reclamation/reclamation.component';
import { AjoutEvaluationComponent } from './admin/Trainings/ajout-evaluation/ajout-evaluation.component';
import { TrainingDetailComponent } from './training-detail/training-detail.component';
import { EvaluationDetailsComponent } from './shared/evaluation-details/evaluation-details.component';
import { CandidateFormComponent } from './shared/Candidats/candidat-form/candidat-form.component';
import { ApplyJobComponent } from './shared/apply-job/apply-job.component';
import { ChartsComponent } from './shared/Problems/charts/charts.component';
import { UserSubscriptionViewComponent } from './shared/user-subscription-view/user-subscription-view.component';
import { SubscriptionFormComponent } from './shared/subscription-form/subscription-form.component';
import { PaymentComponent } from './shared/payment/payment.component';
import { SuccessComponent } from './shared/success/success.component';
import { ErrorComponent } from './shared/error/error.component';
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  declarations: [
    AppComponent,
    ListProblemComponent,
    ProblemSubmitionComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    UserSubscriptionViewComponent,
    SubscriptionFormComponent,
    PaymentComponent,
    SuccessComponent,
    ErrorComponent,
    CoursesComponent,
    CompetionComponent,
    AddPostComponent,
    ViewAllComponent,
    ViewPostComponent,
    HomeAdminComponent,
    AddProblemComponent,
    SidebarComponent,
    CompetitionsComponent,
    AddCompetitionComponent,
    ListCompetitionComponent,
    AddTrainingsComponent,
    CandidatListComponent,
    CandidatListComponent,
    JobListComponent,
    JobFormComponent,
    ListProblemsComponent,
    UsersListComponent,
    SubsCreateComponentComponent,
    SubsListComponent,
    SubsComponent,
    SubUpdateComponent,
    ListereclamationComponent,
    ReclamationComponent,
    AjoutEvaluationComponent,
    TrainingDetailComponent,
    EvaluationDetailsComponent,
    EvaluationDetailsComponent,CandidateFormComponent, ApplyJobComponent, 

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatMenuModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }