import { Injectable } from '@angular/core';
import { Urls } from '../config/Urls';
import { HttpClient } from '@angular/common/http';
import { Competition } from '../models/Competition';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompetionService {
    private Competitions = Urls.Competition;

  constructor(private http:HttpClient) { }
   getCompetitions():Observable<Competition[]>{
      return this.http.get<Competition[]>(this.Competitions);
        }
}
