// question.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Urls} from "../config/Urls";
import {Question} from "../models/Question"; // Assurez-vous que l'import du modèle est correct

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private apiUrl =   Urls.questions

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl);
  }
}
