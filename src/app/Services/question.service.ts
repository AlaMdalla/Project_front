import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Urls } from '../config/Urls';
import { Question } from '../models/Question'; // Vérifie l'import du modèle

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = Urls.questions; // URL définie dans config

  constructor(private http: HttpClient) {}


  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>('${this.apiUrl}retrieve-all');
  }
  addQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/add`, question);
  }
}
