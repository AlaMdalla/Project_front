import { Injectable } from '@angular/core';
import { Urls } from '../config/Urls';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Training } from '../models/Training';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private trainings = Urls.training;
  constructor(private http:HttpClient) { }
gettrainings():Observable<Training[]>{
    return this.http.get<Training[]>(this.trainings);
      }
  // Add new training
  getTrainingById(id: number): Observable<Training> {
    return this.http.get<Training>(`${this.trainings}${id}`);
  }

  // Add new training
  addTraining(trainingData: Training): Observable<Training> {
    return this.http.post<Training>(`${this.trainings}add-training`, trainingData);
  }
  // Modify an existing training
  modifyTraining(trainingData: Training): Observable<Training> {
    return this.http.put<Training>(`${this.trainings}modify-training`, trainingData);
  }

  // Delete a training by ID
  deleteTraining(trainingId: number): Observable<void> {
    return this.http.delete<void>(`${this.trainings}remove-training/${trainingId}`);
  }
}
