import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Urls } from '../config/Urls';

const BASIC_URL = Urls.BASIC_URL;

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) {}

  private getHeaders(userId?: number): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    if (userId) {
      headers = headers.set('User-Id', userId.toString());
    }
    return headers;
  }

  createNewPost(userId: number, formData: FormData): Observable<any> {
    return this.http.post(BASIC_URL + `blog/posts/create/${userId}`, formData, { observe: 'response' });
  }

  getAllPosts(): Observable<any> {
    return this.http.get(BASIC_URL + `blog/posts`, {
      headers: this.getHeaders()
    });
  }

  getPostById(userId: number, postId: number): Observable<any> {
    return this.http.get(BASIC_URL + `blog/posts/${postId}`, {
        headers: this.getHeaders(userId)
    });
}

  viewPost(userId: number, postId: number): Observable<any> {
    return this.http.put(BASIC_URL + `blog/posts/${postId}/view`, {}, {
      headers: this.getHeaders(userId)
    });
  }

  reactPost(userId: number, postId: number, reaction: string): Observable<any> {
    const params = new HttpParams().set('reaction', reaction);
    return this.http.put(`${BASIC_URL}blog/posts/${postId}/react`, {}, {
      headers: this.getHeaders(userId),
      params
    });
  }

  deletePostById(userId: number, postId: number): Observable<void> {
    return this.http.delete<void>(BASIC_URL + `blog/posts/${postId}`, {
      headers: this.getHeaders(userId)
    });
  }

  updatePost(userId: number, postId: number, formData: FormData): Observable<any> {
    return this.http.put(BASIC_URL + `blog/posts/${postId}`, formData, {
      headers: this.getHeaders(userId),
      observe: 'response'
    });
  }

  sharePostOnFacebook(userId: number, postId: number, accessToken: string): Observable<any> {
    const params = new HttpParams()
        .set('userId', userId.toString())
        .set('accessToken', accessToken);
    return this.http.post(BASIC_URL + `${postId}/share-on-facebook`, null, { params });
}

}