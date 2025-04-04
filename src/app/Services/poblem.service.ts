import { Injectable } from '@angular/core';
import { Urls } from '../config/Urls';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Problem } from '../models/Problem';

@Injectable({
  providedIn: 'root'
})
export class PoblemService {
  private Problems = Urls.Problems;

  constructor(private http:HttpClient) { }
  getProblems():Observable<Problem[]>{
    return this.http.get<Problem[]>(this.Problems);
      }
      
          getProblem(id? :number):Observable<Problem>{
            return this.http.get<Problem>(this.Problems+`${id}`);
              }
              addProblem(problem:Problem):Observable<Problem>{
                return this.http.post<Problem>(this.Problems,problem);
              }
              
              deleteProblemById(problemId: number): Observable<string> {
                return this.http.delete(this.Problems + problemId, { responseType: 'text' });
              }
              updateProblem(id: number, problem: Problem): Observable<Problem> {
                return this.http.put<Problem>(`${this.Problems}/${id}`, problem);
              }
              getPassedProblems(idUser? :number,):Observable<String[]>{
                return this.http.get<String[]>(this.Problems+`passedProblems/${idUser}`);

                  }
              
              
}
