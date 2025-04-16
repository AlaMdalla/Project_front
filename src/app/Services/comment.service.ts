import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Urls } from '../config/Urls';

const BASIC_URL = Urls.BASIC_URL;

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private http: HttpClient) {}

  createComment(userId: number, postId: number, content: string): Observable<any> {
    const headers = new HttpHeaders({ 'User-Id': userId.toString() });
    const params = new HttpParams()
      .set('postId', postId.toString())
      .set('content', content);

    console.log("Sending comment: { userId:", userId, ", postId:", postId, ", content:", content, "}");

    return this.http.post(`${BASIC_URL}blog/comments/create`, null, { headers, params });
  }

  getAllCommentByPost(postId: number): Observable<any> {
    return this.http.get(`${BASIC_URL}blog/comments/post/${postId}`);
  }

  replyToComment(userId: number, parentCommentId: number, content: string): Observable<any> {
    const params = new HttpParams()
      .set('parentCommentId', parentCommentId.toString())
      .set('userId', userId.toString())
      .set('content', content);

    return this.http.post(`${BASIC_URL}blog/comments/reply`, null, { params });
  }

  reactComment(userId: number, commentId: number, reaction: string): Observable<any> {
    const params = { reaction };
    const headers = new HttpHeaders({ 'User-Id': userId.toString() });

    return this.http.put(`${BASIC_URL}blog/comments/${commentId}/react`, null, { headers, params });
  }
}