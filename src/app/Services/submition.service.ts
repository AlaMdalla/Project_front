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
 submitSolution(userId?: number,problemId?: number, code?: string): Observable<string> {
  console.log('code',code )
  return this.http.post<string>(
    `${this.submitions}submit/${userId}/${problemId}`, 
    code, // Send plain string instead of an object
    { headers: { 'Content-Type': 'text/plain' },
    responseType: 'text'  as 'json'
} 
  ).pipe(
    catchError(error => {
      console.error('Error occurred:', error);
      return throwError(error);
    })
  );
  
}
getSubmitionsByUser(idUser? :number,):Observable<any[]>{
                return this.http.get<any[]>(this.submitions+`${idUser}`);

                  }
                  getProblemTitle(submitId? :number,):Observable<string>{
                    return this.http.get<string>(this.submitions+`getProblemTitle/${submitId}`);
    
                      }
}
