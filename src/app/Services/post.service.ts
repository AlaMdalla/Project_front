import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Urls } from '../config/Urls';

const BASIC_URL = Urls.BASIC_URL;

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) { }

  createNewPost(formData: FormData): Observable<any> {
    return this.http.post(BASIC_URL + `blog/posts`, formData, { observe: 'response' });
  }

  getAllPosts(): Observable<any> {
    return this.http.get(BASIC_URL + `blog/posts`);
  }

  getPostById(postId: number): Observable<any> {
    return this.http.get(BASIC_URL + `blog/posts/${postId}`);
  }
  reactPost(postId: number, reaction: string): Observable<any> {
    const params = new HttpParams().set('reaction', reaction);
    return this.http.put(`${BASIC_URL}blog/posts/${postId}/react`, {}, { params });
  }

  deletePostById(postId: number): Observable<void> {
    return this.http.delete<void>(BASIC_URL + `blog/posts/${postId}`);
  }
  updatePost(postId: number, formData: FormData): Observable<any> {
    return this.http.put(BASIC_URL + `blog/posts/${postId}`, formData, { observe: 'response' });
  }
  
  
}