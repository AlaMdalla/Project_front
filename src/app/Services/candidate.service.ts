import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate } from '../models/Candidate'; // Adjust path as needed
import { Urls } from '../config/Urls'; // Adjust path as needed

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private apiUrl = Urls.candidates; // Use centralized URL config

  constructor(private http: HttpClient) {}

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.apiUrl);
  }

  getCandidateById(id: number): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.apiUrl}/${id}`);
  }

  getCandidateResume(id: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${id}/resume`, { responseType: 'text' as 'json' });
  }

  uploadResume(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${this.apiUrl}/upload`, formData, { responseType: 'text' as 'json' });
  }

  createCandidate(candidate: any): Observable<void> {
    const request = {
      id: candidate.id,
      email: candidate.email,
      phone: candidate.phone,
      resumeUrl: candidate.resumeUrl,
      applicationDate: candidate.applicationDate ? new Date(candidate.applicationDate) : null,
      status: candidate.status,
      jobId: candidate.jobId
    };
    return this.http.post<void>(this.apiUrl, request);
  }

  updateCandidate(id: number, candidate: any): Observable<Candidate> {
    const request = {
      id: id,
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