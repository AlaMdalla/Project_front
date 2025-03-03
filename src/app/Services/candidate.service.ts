import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate } from '../models/Candidate';
import { Urls } from '../config/Urls';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private apiUrl = Urls.candidates;

  constructor(private http: HttpClient) {}

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.apiUrl);
  }

  getCandidateById(id: number): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.apiUrl}/${id}`);
  }

  getCandidateResume(id?: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${id}/resume`, { responseType: 'text' as 'json' });
  }

  createCandidate(candidate: any): Observable<void> {
    const request = {
      id: candidate.id, // Include id, will be undefined for new candidates
      email: candidate.email,
      phone: candidate.phone,
      resumeUrl: candidate.resumeUrl,
      applicationDate: candidate.applicationDate ? new Date(candidate.applicationDate) : null,
      status: candidate.status,
      jobId: candidate.jobId
    };
    console.log('Sending to backend:', JSON.stringify(request, null, 2));
    return this.http.post<void>(this.apiUrl, request);
  }
  
  updateCandidate(id: number, candidate: any): Observable<Candidate> {
    const request = {
      id: id, // Use the parameter id for update
      email: candidate.email,
      phone: candidate.phone,
      resumeUrl: candidate.resumeUrl,
      applicationDate: candidate.applicationDate ? new Date(candidate.applicationDate) : null,
      status: candidate.status,
      jobId: candidate.jobId
    };
    return this.http.put<Candidate>(`${this.apiUrl}/${id}`, request);
  }

  deleteCandidate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}