import { Component, OnInit } from '@angular/core';

import { Question } from '../models/Question';
import {QuestionService} from "../Services/question.service";

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit {
  questions: Question[] = [];

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.questionService.getQuestions().subscribe(
      (data: Question[]) => {
        this.questions = data;
        console.log('Questions chargées :', this.questions);
      },
      (error) => {
        console.error('Erreur lors du chargement des questions', error);
      }
    );
  }
}
