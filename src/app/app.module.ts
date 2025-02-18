import { NgModule } from '@angular/core';
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

@NgModule({
  declarations: [
    AppComponent,
    ListProblemComponent,
    ProblemSubmitionComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
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