import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ListProblemComponent } from './shared/Problems/list-problem/list-problem.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProblemSubmitionComponent } from './shared/Problems/problem-submition/problem-submition.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    ListProblemComponent,
    ProblemSubmitionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule ,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    AppRoutingModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
