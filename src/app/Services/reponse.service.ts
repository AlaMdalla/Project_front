import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Urls} from "../config/Urls";
import {Reponse} from "../models/Reponse";

@Injectable({
  providedIn: 'root'
})
export class ReponseService {
  private apiUrl = Urls.reponses

  constructor(private http: HttpClient) {}


  addReponses(reponsesData: Reponse[]): Observable<Reponse[]> {
    return this.http.post<Reponse[]>(`${this.apiUrl}/add-batch`, reponsesData);
  }


  getReponsesByEvaluation(evaluationId: number): Observable<Reponse[]> {
    return this.http.get<Reponse[]>(`${this.apiUrl}/evaluation/${evaluationId}`);
  }
}
