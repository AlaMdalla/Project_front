import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { CommentService } from "src/app/Services/comment.service";
import { PostService } from "src/app/Services/post.service";
import { ReclamationService } from "src/app/Services/reclamation.service";
import { UsersService } from "src/app/Services/users.service";
import { forkJoin, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Define the expected response type for getOwnUsersById
interface UserResponse {
  ourUsers: {
    id: number;
    name: string;
    // Add other fields if needed
  };
}
// Define a custom type for form control errors
interface CommentFormErrors {
  required?: boolean;
  maxlength?: { requiredLength: number; actualLength: number };
  invalid?: boolean;
}

const BAD_WORDS = ['bad', 'trash', 'hate', 'damn', 'crap', 'fool', 'jerk', 'stupid', 'idiot'];

function containsBadWords(content: string): boolean {
  if (!content) return false;
  const lowerCaseContent = content.toLowerCase();
  return BAD_WORDS.some(badWord => lowerCaseContent.includes(badWord.toLowerCase()));
}

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
  userId?: number;
  hasReacted: boolean = false;
  hasViewed: boolean = false;
  activeReplyCommentId: number | null = null; // Track the comment with the active reply form

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private matSnackBar: MatSnackBar,
    private fb: FormBuilder,
    private commentService: CommentService,
    private reclamationService: ReclamationService,
    private router: Router,
    private usersService: UsersService
  ) {
    this.postId = +this.activatedRoute.snapshot.params['id'];
  }

  async ngOnInit() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const profileInfo = await this.usersService.getYourProfile(token);
        this.userId = profileInfo.ourUsers.id;
        console.log('User ID:', this.userId);
      }
    } catch (error: any) {
      console.log('Error fetching user profile:', error.message);
    }

    this.CommentForm = this.fb.group({
      content: [null, [Validators.required, Validators.maxLength(500)]],
    });

    if (this.userId) {
      const viewedKey = `viewed_post_${this.postId}_${this.userId}`;
      const reactedKey = `reacted_post_${this.postId}_${this.userId}`;
      this.hasViewed = !!localStorage.getItem(viewedKey);
      this.hasReacted = !!localStorage.getItem(reactedKey);
    }

    this.getPostById();
  }

  hoverReaction(reaction: string | null) {
    this.hoveredReaction = reaction;
  }

  publishComment() {
    if (!this.userId) {
      this.matSnackBar.open("Vous devez être connecté pour commenter", "Close", { duration: 5000 });
      return;
    }
  
    const content = this.CommentForm.get('content')?.value;
  
    if (containsBadWords(content)) {
      this.matSnackBar.open("Your comment contains inappropriate language. Please revise it.", "Close", { duration: 5000 });
      return;
    }
  
    this.commentService.createComment(this.userId, this.postId, content).subscribe(
      res => {
        this.matSnackBar.open("Comment Published Successfully", "Ok", { duration: 3000 });
        this.CommentForm.reset();
        this.getCommentByPost();
      },
      error => {
        const errorMessage = error.error || "Something Went Wrong!!";
        this.matSnackBar.open(errorMessage, "Close", { duration: 5000 });
        if (errorMessage.includes("inappropriate language") || errorMessage.includes("already posted this comment")) {
          this.CommentForm.get('content')?.setErrors({ invalid: true } as CommentFormErrors);
        }
      }
    );
  }

  async getPostById() {
    if (!this.userId) {
      this.matSnackBar.open("Connexion requise pour voir le post", "Close", { duration: 3000 });
      return;
    }

    const userId = this.userId;

    this.postService.getPostById(userId, this.postId).subscribe(
      async res => {
        let name = 'Unknown User';
        try {
          const userResponse = await this.usersService.getOwnUsersById(res.userId.toString());
          console.log('User Response for userId', res.userId, ':', userResponse);
          name = userResponse.ourUsers?.name || 'Unknown User';
        } catch (error) {
          console.error(`Error fetching user for post ${this.postId}:`, error);
        }

        this.postData = {
          ...res,
          
          name
        };

        if (!this.hasViewed) {
          this.postService.viewPost(userId, this.postId).subscribe(
            () => {
              console.log('View count incremented');
              const viewedKey = `viewed_post_${this.postId}_${userId}`;
              localStorage.setItem(viewedKey, 'true');
              this.hasViewed = true;
              this.postData.viewCount = (this.postData.viewCount || 0) + 1;
            },
            error => {
              const errorMessage = error.error || "Error incrementing view count";
              this.matSnackBar.open(errorMessage, "Close", { duration: 3000 });
              if (errorMessage.includes("already viewed")) {
                const viewedKey = `viewed_post_${this.postId}_${userId}`;
                localStorage.setItem(viewedKey, 'true');
                this.hasViewed = true;
              }
            }
          );
        }

        this.getCommentByPost();
      },
      error => {
        this.matSnackBar.open("Something went wrong!!", "Close", { duration: 3000 });
      }
    );
  }

  getCommentByPost() {
    this.commentService.getAllCommentByPost(this.postId).subscribe(
      res => {
        // Step 1: Map comments and add avatar, replyContent, and replies
        let comments = res.map((comment: any) => ({
          ...comment,
          
          replyContent: '',
          replies: comment.replies?.map((reply: any) => ({
            ...reply,
           
          })) || []
        }));
  
        // Step 2: Filter out duplicate comments (same content and userId)
        const seen = new Set<string>();
        comments = comments.filter((comment: any) => {
          const key = `${comment.userId}-${comment.content}`;
          if (seen.has(key)) {
            return false; // Skip duplicate
          }
          seen.add(key);
          return true; // Keep unique comment
        });
  
        // Step 3: Get all unique userIds from comments and replies
        const userIds = new Set<number>();
        comments.forEach((comment: any) => {
          userIds.add(comment.userId);
          comment.replies?.forEach((reply: any) => userIds.add(reply.userId));
        });
  
        // Step 4: Fetch usernames for all unique userIds in parallel
        const userRequests: Observable<any>[] = Array.from(userIds).map(userId =>
          from(this.usersService.getOwnUsersById(userId.toString())).pipe(
            map((userResponse: UserResponse) => ({
              userId,
              username: userResponse.ourUsers?.name || 'Unknown User'
            }))
          )
        );
  
        forkJoin(userRequests).subscribe(
          (userData: any[]) => {
            // Step 5: Create a map of userId to username
            const userMap = new Map<number, string>();
            userData.forEach(user => userMap.set(user.userId, user.username));
  
            // Step 6: Assign usernames to comments and replies
            this.comments = comments.map((comment: any) => ({
              ...comment,
              username: userMap.get(comment.userId) || 'Unknown User',
              replies: comment.replies?.map((reply: any) => ({
                ...reply,
                username: userMap.get(reply.userId) || 'Unknown User'
              })) || []
            }));
          },
          error => {
            console.error('Error fetching usernames:', error);
            this.comments = comments.map((comment: any) => ({
              ...comment,
              username: 'Unknown User',
              replies: comment.replies?.map((reply: any) => ({
                ...reply,
                username: 'Unknown User'
              })) || []
            }));
          }
        );
      },
      error => {
        this.matSnackBar.open("Something went wrong!!", "Close", { duration: 3000 });
      }
    );
  }
  reactPost(reaction: string) {
    if (!this.userId) {
      this.matSnackBar.open("Vous devez être connecté pour réagir", "Close", { duration: 3000 });
      return;
    }

    if (this.hasReacted) {
      this.matSnackBar.open("Vous avez déjà réagi à ce post", "Close", { duration: 3000 });
      return;
    }

    this.postService.reactPost(this.userId, this.postId, reaction).subscribe(
      res => {
        this.matSnackBar.open(`Post reacted with ${reaction} successfully`, "Close", { duration: 3000 });
        const reactedKey = `reacted_post_${this.postId}_${this.userId}`;
        localStorage.setItem(reactedKey, 'true');
        this.hasReacted = true;

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
        const errorMessage = error.error || "Something Wrong!!";
        this.matSnackBar.open(errorMessage, "Close", { duration: 3000 });
        if (errorMessage.includes("already reacted")) {
          const reactedKey = `reacted_post_${this.postId}_${this.userId}`;
          localStorage.setItem(reactedKey, 'true');
          this.hasReacted = true;
        }
      }
    );
  }

  toggleReplyForm(commentId: number) {
    // If the clicked comment is already active, close the reply form
    if (this.activeReplyCommentId === commentId) {
      this.activeReplyCommentId = null;
    } else {
      // Open the reply form for the clicked comment and close any other open reply form
      this.activeReplyCommentId = commentId;
    }
  }

  replyToComment(commentId: number) {
    if (!this.userId) {
      this.matSnackBar.open("Vous devez être connecté pour répondre", "Close", { duration: 5000 });
      return;
    }

    const comment = this.comments.find(c => c.id === commentId);
    if (comment) {
      if (this.userId === comment.userId) {
        this.matSnackBar.open("Vous ne pouvez pas répondre à votre propre commentaire", "Close", { duration: 5000 });
        return;
      }

      if (comment.replyContent) {
        this.commentService.replyToComment(this.userId, commentId, comment.replyContent).subscribe(
          res => {
            this.matSnackBar.open("Reply posted successfully!", "Close", { duration: 3000 });
            comment.replyContent = '';
            this.activeReplyCommentId = null; // Close the reply form after submitting
            this.getCommentByPost();
          },
          error => {
            const errorMessage = error.error || "Error posting reply!";
            this.matSnackBar.open(errorMessage, "Close", { duration: 5000 });
            if (errorMessage.includes("inappropriate language")) {
              comment.replyContent = '';
            }
          }
        );
      }
    }
  }

  goToReclamationForm() {
    if (this.userId) {
      this.router.navigate([`/reclamation/${this.postId}`], { queryParams: { userId: this.userId } });
    } else {
      this.matSnackBar.open("Vous devez être connecté pour soumettre une réclamation", "Close", { duration: 5000 });
      this.router.navigate(['/login']);
    }
  }
}