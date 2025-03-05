import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from 'src/app/Services/post.service';

// Updated Post interface to match the backend entity
interface Post {
avatar: any;
  id: number;
  title: string;
  category: string;
  content: string;
  postedBy: string;
  img: string | null; // Base64 string from backend
  date: Date;
  likeCount: number;
  laught: number;
  angry: number;
  viewCount: number;
}

@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.component.html',
  styleUrls: ['./view-all.component.css']
})
export class ViewAllComponent implements OnInit {
  allPosts: Post[] = [];

  constructor(private postService: PostService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.getAllPosts();
  }


  getAllPosts() {
    this.postService.getAllPosts().subscribe({
      next: (res: Post[]) => {
        console.log('Raw response:', res); // Log the raw response
        this.allPosts = res.map(post => {
          console.log('Post img value:', post.img); // Log the img value for debugging
          return {
            ...post,
            avatar: `assets/img/avatar${post.postedBy}.jpg` // Assuming avatars are named by postedBy
          };
        });
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
        this.snackBar.open("Something went wrong!!", "Close", { duration: 3000 });
      }
    });
  }

  deletePost(postId: number) {
    if (confirm("Are you sure you want to delete this post?")) {
      this.postService.deletePostById(postId).subscribe({
        next: () => {
          this.snackBar.open("Post deleted successfully!", "Close", { duration: 3000 });
          this.getAllPosts(); // Refresh the list
        },
        error: (error) => {
          console.error('Error deleting post:', error);
          this.snackBar.open("Something went wrong!!", "Close", { duration: 3000 });
        }
      });
    }
  }
}