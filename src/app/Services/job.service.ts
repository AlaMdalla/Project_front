import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../models/Job';
import { Urls } from '../config/Urls';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private apiUrl = Urls.job;

  constructor(private http: HttpClient) {}

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl);
  }

  getJobById(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`);

  }

  getJobImage(id: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${id}/image`, { responseType: 'text' as 'json' });
  }

  createJob(job: Job): Observable<void> {
    return this.http.post<void>(this.apiUrl, job);
  }

  updateJob(id: number, job: Job): Observable<Job> {
    return this.http.put<Job>(`${this.apiUrl}/${id}`, job);
  }

  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
