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
import { Meta } from '@angular/platform-browser';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// Define the expected response type for getOwnUsersById
interface UserResponse {
    ourUsers: {
        id: number;
        name: string;
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
    styleUrls: ['./view-post.component.css'],
    standalone: false,
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
    activeReplyCommentId: number | null = null;

    constructor(
        private postService: PostService,
        private activatedRoute: ActivatedRoute,
        private matSnackBar: MatSnackBar,
        private fb: FormBuilder,
        private commentService: CommentService,
        private reclamationService: ReclamationService,
        private router: Router,
        private usersService: UsersService,
        private meta: Meta
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
            this.router.navigate(['/login']);
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
            async (res) => {
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

                const description = this.postData.content
                    ? this.truncateToLastWord(this.postData.content, 200) + '...'
                    : 'Default Description';

                this.meta.addTags([
                    { property: 'og:title', content: this.postData.title || 'Default Title' },
                    { property: 'og:description', content: description },
                    { property: 'og:url', content: `https://localhost:4200/view-post/${this.postId}` },
                    { property: 'og:image', content: this.postData.imageUrl || 'https://via.placeholder.com/1200x630.png?text=Default+Image' },
                    { property: 'og:type', content: 'article' }
                ]);

                if (!this.hasViewed) {
                    this.postService.viewPost(userId, this.postId).subscribe(
                        () => {
                            console.log('View count incremented');
                            const viewedKey = `viewed_post_${this.postId}_${userId}`;
                            localStorage.setItem(viewedKey, 'true');
                            this.hasViewed = true;
                            this.postData.viewCount = (this.postData.viewCount || 0) + 1;
                        },
                        (error) => {
                            const errorMessage = error.error || "Error incrementing view count";
                            this.matSnackBar.open(errorMessage, "Close", { duration: 3000 });
                            if (errorMessage.includes("already viewed")) {
                                const viewedKey = `viewed_post_${this.postId}_${this.userId}`;
                                localStorage.setItem(viewedKey, 'true');
                                this.hasViewed = true;
                            }
                        }
                    );
                }

                this.getCommentByPost();
            },
            (error) => {
                this.matSnackBar.open("Something went wrong!!", "Close", { duration: 3000 });
                this.meta.addTags([
                    { property: 'og:title', content: 'Default Title' },
                    { property: 'og:description', content: 'Default Description' },
                    { property: 'og:url', content: `https://localhost:4200/view-post/${this.postId}` },
                    { property: 'og:image', content: 'https://via.placeholder.com/1200x630.png?text=Default+Image' },
                    { property: 'og:type', content: 'article' }
                ]);
            }
        );
    }

    getCommentByPost() {
        this.commentService.getAllCommentByPost(this.postId).subscribe(
            res => {
                let comments = res.map((comment: any) => ({
                    ...comment,
                    replyContent: '',
                    replies: comment.replies?.map((reply: any) => ({
                        ...reply,
                        hasReacted: !!localStorage.getItem(`reacted_comment_${reply.id}_${this.userId}`),
                        hoveredReaction: null // Ajout pour gérer le survol des réactions
                    })) || [],
                    hasReacted: !!localStorage.getItem(`reacted_comment_${comment.id}_${this.userId}`),
                    hoveredReaction: null // Ajout pour gérer le survol des réactions
                }));

                const seen = new Set<string>();
                comments = comments.filter((comment: any) => {
                    const key = `${comment.userId}-${comment.content}`;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                });

                const userIds = new Set<number>();
                comments.forEach((comment: any) => {
                    userIds.add(comment.userId);
                    comment.replies?.forEach((reply: any) => userIds.add(reply.userId));
                });

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
                        const userMap = new Map<number, string>();
                        userData.forEach(user => userMap.set(user.userId, user.username));
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
                        this.matSnackBar.open("Failed to fetch usernames for comments", "Close", { duration: 3000 });
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
                this.matSnackBar.open("Failed to load comments!", "Close", { duration: 3000 });
            }
        );
    }

    reactPost(reaction: string) {
        if (!this.userId) {
            this.matSnackBar.open("Vous devez être connecté pour réagir", "Close", { duration: 3000 });
            this.router.navigate(['/login']);
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
                            this.postData.laugh = (this.postData.laugh || 0) + 1;
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

    reactComment(commentId: number, reaction: string, isReply: boolean = false) {
        if (!this.userId) {
            this.matSnackBar.open("Vous devez être connecté pour réagir", "Close", { duration: 3000 });
            this.router.navigate(['/login']);
            return;
        }

        const comment = isReply
            ? this.comments.flatMap((c: any) => c.replies).find((r: any) => r.id === commentId)
            : this.comments.find((c: any) => c.id === commentId);

        if (!comment) {
            this.matSnackBar.open("Commentaire non trouvé", "Close", { duration: 3000 });
            return;
        }

        if (comment.hasReacted) {
            this.matSnackBar.open("Vous avez déjà réagi à ce commentaire", "Close", { duration: 3000 });
            return;
        }

        this.commentService.reactComment(this.userId, commentId, reaction).subscribe(
            res => {
                this.matSnackBar.open(`Comment reacted with ${reaction} successfully`, "Close", { duration: 3000 });
                const reactedKey = `reacted_comment_${commentId}_${this.userId}`;
                localStorage.setItem(reactedKey, 'true');
                comment.hasReacted = true;

                switch (reaction) {
                    case 'like':
                        comment.likeCount = (comment.likeCount || 0) + 1;
                        break;
                    case 'laugh':
                        comment.laught = (comment.laught || 0) + 1;
                        break;
                    case 'angry':
                        comment.angry = (comment.angry || 0) + 1;
                        break;
                }
            },
            error => {
                const errorMessage = error.error || "Erreur lors de la réaction au commentaire";
                this.matSnackBar.open(errorMessage, "Close", { duration: 3000 });
                if (errorMessage.includes("already reacted")) {
                    const reactedKey = `reacted_comment_${commentId}_${this.userId}`;
                    localStorage.setItem(reactedKey, 'true');
                    comment.hasReacted = true;
                }
            }
        );
    }

    hoverCommentReaction(commentId: number, reaction: string | null, isReply: boolean = false) {
        const comment = isReply
            ? this.comments.flatMap((c: any) => c.replies).find((r: any) => r.id === commentId)
            : this.comments.find((c: any) => c.id === commentId);

        if (comment) {
            comment.hoveredReaction = reaction;
        }
    }

    toggleReplyForm(commentId: number) {
        if (this.activeReplyCommentId === commentId) {
            this.activeReplyCommentId = null;
        } else {
            this.activeReplyCommentId = commentId;
        }
    }

    
    replyToComment(commentId: number) {
        if (!this.userId) {
            this.matSnackBar.open("Vous devez être connecté pour répondre", "Close", { duration: 5000 });
            this.router.navigate(['/login']);
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
                        this.activeReplyCommentId = null;
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

    openShareDialog() {
        if (!this.userId) {
            this.matSnackBar.open("Vous devez être connecté pour partager", "Close", { duration: 5000 });
            this.router.navigate(['/login']);
            return;
        }

        const shareUrl = `https://localhost:4200/view-post/${this.postId}`;
        if (!shareUrl) {
            this.matSnackBar.open("Error: Invalid post URL.", "Close", { duration: 5000 });
            return;
        }

        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        const shareWindow = window.open(facebookShareUrl, '_blank', 'width=600,height=400');

        if (!shareWindow) {
            this.matSnackBar.open("Unable to open share window. Please allow popups for this site.", "Close", { duration: 5000 });
        } else {
            this.matSnackBar.open("Share window opened. Please complete the sharing process on Facebook.", "Close", { duration: 5000 });
        }
    }

    truncateToLastWord(text: string, maxLength: number): string {
        if (!text || maxLength <= 0) return '';
        if (text.length <= maxLength) return text;

        const trimmed = text.substring(0, maxLength);
        const lastSpace = trimmed.lastIndexOf(' ');
        return lastSpace > 0 ? trimmed.substring(0, lastSpace) : trimmed;
    }
}