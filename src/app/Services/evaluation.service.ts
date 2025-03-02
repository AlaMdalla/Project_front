import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// @ts-ignore
import { Evaluation } from '../models/evaluation.model';
import {Urls} from "../config/Urls";

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl =  Urls.evaluations
  ;

  constructor(private http: HttpClient) {}


  getAllEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/retrieve-all`);
  }

  getEvaluationById(id: number): Observable<Evaluation> {
    return this.http.get<Evaluation>(`${this.apiUrl}/${id}`);
  }

  addEvaluation(evaluation: Evaluation): Observable<Evaluation> {
    return this.http.post<Evaluation>(`${this.apiUrl}/add`, evaluation);
  }

  updateEvaluation(id: number, evaluation: Evaluation): Observable<Evaluation> {
    return this.http.put<Evaluation>(`${this.apiUrl}/update/${id}`, evaluation);
  }

  deleteEvaluation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }


}
