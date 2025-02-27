import { Injectable } from '@angular/core';
import { Urls } from '../config/Urls';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { Training } from '../models/Training';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private trainings = Urls.training;
  constructor(private http:HttpClient) { }
gettrainings():Observable<Training[]>{
    return this.http.get<Training[]>(this.trainings+"retrieve-all-trainings")
}}
