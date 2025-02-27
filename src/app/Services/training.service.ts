import { Injectable } from '@angular/core';
import { Urls } from '../config/Urls';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Training } from '../models/Training';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private trainings = Urls.training;
  constructor(private http:HttpClient) { }
  gettrainings(): Observable<Training[]> {
    return this.http.get<any>(this.trainings).pipe(
      map(response => {
        // Handle different response formats and ensure we return an array
        if (Array.isArray(response)) {
          return response;
        } else if (response && typeof response === 'object') {
          // Try common API patterns (data, content, items, etc.)
          const possibleArrayProps = ['trainings', 'data', 'content', 'items', 'results', 'list'];
          
          for (const prop of possibleArrayProps) {
            if (Array.isArray(response[prop])) {
              return response[prop];
            }
          }
          
          // If it's an object with training-like properties, try to convert
          return Object.values(response);
        }
        
        // Fallback to empty array
        return [];
      })
    );
  }

}