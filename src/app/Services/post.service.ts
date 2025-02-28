import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Urls } from '../config/Urls';

const BASIC_URL = Urls.BASIC_URL;

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  createNewPost(data: any): Observable<any> {
    return this.http.post(BASIC_URL + `blog/posts`, data);
  }

  getAllPosts(): Observable<any> {
    return this.http.get(BASIC_URL + `blog/posts`);
  }

  getPostById(postId: number): Observable<any> {
    return this.http.get(BASIC_URL + `blog/posts/${postId}`);
  }

  deletePostById(postId: number): Observable<void> {
    return this.http.delete<void>(BASIC_URL + `blog/posts/${postId}`);
  }
}
