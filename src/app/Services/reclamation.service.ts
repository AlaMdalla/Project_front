import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from '../config/Urls';
const BASIC_URL = Urls.BASIC_URL;
@Injectable({
  providedIn: 'root'
})
export class ReclamationService {

  constructor(private http: HttpClient) {}

  createReclamation(postId: number, reason: string, email: string, name: string): Observable<any> {
    const params = { postId, reason, email, name };
    return this.http.post(BASIC_URL + `blog/posts/reclamations/create`, null, { params });
  }

  getAllReclamations(): Observable<any[]> {
    return this.http.get<any[]>(BASIC_URL + `blog/posts/reclamations`);
  }

  getReclamationById(id: number): Observable<any> {
    return this.http.get(BASIC_URL + `blog/posts/reclamations/${id}`);
  }

  updateReclamation(id: number, reclamation: any): Observable<any> {
    return this.http.put(BASIC_URL + `blog/posts/reclamations/${id}`, reclamation);
  }

  deleteReclamation(id: number): Observable<any> {
    return this.http.delete(BASIC_URL + `blog/posts/reclamations/${id}`);
  }

  getReclamationsByPostId(postId: number): Observable<any[]> {
    return this.http.get<any[]>(BASIC_URL + `blog/posts/reclamations/${postId}`);
  }
}
