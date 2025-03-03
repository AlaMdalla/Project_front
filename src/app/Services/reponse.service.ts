import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Urls} from "../config/Urls";

@Injectable({
  providedIn: 'root'
})
export class ReponseService {
  private apiUrl = Urls.reponses

  constructor(private http: HttpClient) {}

  ajouterReponse(reponse: any): Observable<any> {
    return this.http.post(this.apiUrl, reponse);
  }
}
