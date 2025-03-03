import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from '../config/Urls';

const BASIC_URL = Urls.BASIC_URL;

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  createComment(postId:number, postedBy: string, content: string):Observable<any>{

    const params = {
      postId: postId,
      postedBy: postedBy,
      content: content
      
    }
    return this.http.post(BASIC_URL + `blog/comments/create`, content, {params});
  }
  getAllCommentByPost(postId:number):Observable<any>{
    return this.http.get(BASIC_URL + `blog/comments/${postId}`);

  }
  replyToComment(parentCommentId: number, postedBy: string, content: string): Observable<any> {
    const params = { parentCommentId, postedBy, content };
    return this.http.post(BASIC_URL + `blog/comments/reply`, null, { params });
  }
  
}
