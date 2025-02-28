import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from 'src/app/Services/comment.service';
import { PostService } from 'src/app/Services/post.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent {
  postId = this.activatedRoute.snapshot.params['id'];
  postData : any;
  CommentForm! :FormGroup;
  comments:any
  



  constructor(private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private matsnackBar: MatSnackBar,
    private fb: FormBuilder,
    private commentService: CommentService
  ){}
ngOnInit(){
  this.getPostById();

  this.CommentForm = this.fb.group({
    postedBy: [null, Validators.required],
    content: [null, Validators.required],
  })
}

publishComment(){
  const postedBy= this.CommentForm.get('postedBy')?.value;
  const content= this.CommentForm.get('content')?.value;

  this.commentService.createComment(this.postId, postedBy, content).subscribe(res=>{
    this.matsnackBar.open("Comment Published Sucessfully", "Ok");
    
  },error=>{
    this.matsnackBar.open("Something Wrong!!")
  }
)

}

getPostById() {
  this.postService.getPostById(this.postId).subscribe(res => {
    this.getCommentByPost();
    this.postData = {
      ...res,
      avatar: `assets/img/avatar${res.postedBy}.jpg`  
    };
    console.log(this.postData);
  }, error => {
    this.matsnackBar.open("Something went wrong!!");
  });
}
getCommentByPost(){
  this.commentService.getAllCommentByPost(this.postId).subscribe(res => {
    this.comments = res.map((comment: { postedBy: any; }) => {
      return {
        ...comment,
        avatar: `assets/img/avatar${comment.postedBy}.jpg`  
      };
    });
  }, error => {
    this.matsnackBar.open("Something went wrong!!");
  });
}

}
