import { Injectable } from '@angular/core';
import { Urls } from '../config/Urls';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmitionService {
  private submitions = Urls.submitions;
 constructor(private http:HttpClient) { }
 submitSolution(problemId: number, code: string): Observable<string> {
  return this.http.post<string>(`${this.submitions}submit/${problemId}`, { code }).pipe(
    catchError(error => {
      console.error('Error occurred:', error);
      return throwError(error);
    })
  );
}

}
