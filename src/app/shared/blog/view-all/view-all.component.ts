import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from 'src/app/Services/post.service';

@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.component.html',
  styleUrls: ['./view-all.component.css']
})
export class ViewAllComponent {
  avatar: any;
  allPosts: any;

  constructor(private postService: PostService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.getAllPosts();
  }

  getAllPosts() {
    this.postService.getAllPosts().subscribe(res => {
      console.log(res);
      this.allPosts = res.map((post: { postedBy: string; }) => ({
        ...post,
        avatar: `assets/img/avatar${post.postedBy}.jpg`   
      }));
    }, error => {
      this.snackBar.open("Something went wrong!!", "Close", { duration: 3000 });
    });
  }

  deletePost(postId: number) {
    if (confirm("Are you sure you want to delete this post?")) {
      this.postService.deletePostById(postId).subscribe(
        () => {
         
          this.snackBar.open("Post deleted successfully!", "Close", { duration: 3000 });
          this.getAllPosts();  
        },
        (error) => {
          this.snackBar.open("Something went wrong!!", "Close", { duration: 3000 });
        }
      );
    }
  }
  
}
