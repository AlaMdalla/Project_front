import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from '../config/Urls';

const BASIC_URL = Urls.BASIC_URL;

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {

  constructor(private http: HttpClient) {}

  createReclamation(postId: number, userId: number, reason: string): Observable<any> {
    const headers = new HttpHeaders({
      'User-Id': userId.toString()
    });
    const params = { postId, reason };
    return this.http.post(BASIC_URL + `blog/posts/reclamations/create`, null, { headers, params });
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

  exportReclamationsToExcel(): Observable<Blob> {
    return this.http.get(BASIC_URL + `blog/posts/reclamations/export-excel`, {
      responseType: 'blob' // Indique que la réponse est un fichier binaire
    });
  }
}