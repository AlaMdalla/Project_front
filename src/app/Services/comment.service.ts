import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Urls } from '../config/Urls';

const BASIC_URL = Urls.BASIC_URL;

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private http: HttpClient) {}

  createComment(userId: number, postId: number, content: string): Observable<any> {
    const body = {
        userId: userId,
        postId: postId,
        content: content
    };
    return this.http.post(`${BASIC_URL}blog/comments/create`, body);
}

  getAllCommentByPost(postId: number): Observable<any> {
    return this.http.get(`${BASIC_URL}blog/comments/post/${postId}`);
  }

  replyToComment(userId: number, commentId: number, content: string): Observable<any> {
    const body = {
        userId: userId,
        parentCommentId: commentId,
        content: content
    };
    return this.http.post(`${BASIC_URL}blog/comments/create`, body);
}

  reactComment(userId: number, commentId: number, reaction: string): Observable<any> {
    const params = {
      reaction: reaction
    };
    return this.http.put(
      `${BASIC_URL}blog/comments/${commentId}/react`,
      null,
      {
        params,
        headers: { 'User-Id': userId.toString() }
      }
    );
  }
}