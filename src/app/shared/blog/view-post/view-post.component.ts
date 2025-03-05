import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { CommentService } from "src/app/Services/comment.service";
import { PostService } from "src/app/Services/post.service";
import { ReclamationService } from "src/app/Services/reclamation.service";
@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {
  postId: number;
  postData: any;
  CommentForm!: FormGroup;
  comments: any[] = [];
  reclamations: any[] = [];
  hoveredReaction: string | null = null;

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private matSnackBar: MatSnackBar,
    private fb: FormBuilder,
    private commentService: CommentService,
    private reclamationService: ReclamationService,
    private router: Router
  ) {
    this.postId = +this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.getPostById();
    this.CommentForm = this.fb.group({
      postedBy: [null, Validators.required],
      content: [null, Validators.required],
    });
  }
  hoverReaction(reaction: string | null) {
    this.hoveredReaction = reaction; // Update hovered reaction state
  }

  publishComment() {
    const postedBy = this.CommentForm.get('postedBy')?.value;
    const content = this.CommentForm.get('content')?.value;
    this.commentService.createComment(this.postId, postedBy, content).subscribe(
      res => {
        this.matSnackBar.open("Comment Published Successfully", "Ok");
        this.CommentForm.reset();
        this.getCommentByPost();
      },
      error => {
        this.matSnackBar.open("Something Went Wrong!!", "Close", { duration: 3000 });
      }
    );
  }

  getPostById() {
    this.postService.getPostById(this.postId).subscribe(
      res => {
        this.getCommentByPost();
        this.postData = {
          ...res,
          avatar: res.postedBy ? `assets/img/avatar${res.postedBy}.jpg` : 'assets/img/default-avatar.jpg'
        };
      },
      error => {
        this.matSnackBar.open("Something went wrong!!", "Close", { duration: 3000 });
      }
    );
  }

  getCommentByPost() {
    this.commentService.getAllCommentByPost(this.postId).subscribe(
      res => {
        this.comments = res.map((comment: { postedBy: any }) => ({
          ...comment,
          avatar: comment.postedBy ? `assets/img/avatar${comment.postedBy}.jpg` : 'assets/img/default-avatar.jpg',
          showReply: false,
          replyContent: ''
        }));
      },
      error => {
        this.matSnackBar.open("Something went wrong!!", "Close", { duration: 3000 });
      }
    );
  }

  reactPost(reaction: string) {
    this.postService.reactPost(this.postId, reaction).subscribe(
      res => {
        this.matSnackBar.open(`Post reacted with ${reaction} successfully`, "Close", { duration: 3000 });
        if (this.postData) {
          switch (reaction) {
            case 'like':
              this.postData.likeCount = (this.postData.likeCount || 0) + 1;
              break;
            case 'laugh':
              this.postData.laught = (this.postData.laught || 0) + 1;
              break;
            case 'angry':
              this.postData.angry = (this.postData.angry || 0) + 1;
              break;
          }
        }
      },
      error => {
        this.matSnackBar.open("Something Wrong!!", "Close", { duration: 3000 });
      }
    );
  }

  replyToComment(commentId: number) {
    const comment = this.comments.find(c => c.id === commentId);
    if (comment && comment.replyContent) {
      const postedBy = this.CommentForm.get('postedBy')?.value || 'Anonymous';
      this.commentService.replyToComment(commentId, postedBy, comment.replyContent).subscribe(
        res => {
          this.matSnackBar.open("Reply posted successfully!", "Close", { duration: 3000 });
          comment.replyContent = '';
          comment.showReply = false;
          this.getCommentByPost();
        },
        error => {
          console.error('Reply error:', error);
          this.matSnackBar.open("Error posting reply!", "Close", { duration: 3000 });
        }
      );
    }
  }

  goToReclamationForm() {
    this.router.navigate([`/reclamation/${this.postId}`]);
  }
}