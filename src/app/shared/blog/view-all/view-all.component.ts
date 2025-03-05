import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from 'src/app/Services/post.service';

@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.component.html',
  styleUrls: ['./view-all.component.css']
})
export class ViewAllComponent {
  allPosts: any[] = [];
  filteredPosts: any[] = []; // Filtered posts before pagination
  displayedPosts: any[] = []; // Subset of posts to display
  currentPage: number = 1;
  pageSize: number = 5; // Increased page size for better UX
  totalItems: number = 0;
  totalPages: number = 0;
  searchTerm: string = ''; // Bound to the filter input
  sortFilter: string = 'none'; // Bound to the sort filter dropdown ('none', 'likes', 'views')

  constructor(private postService: PostService, private snackBar: MatSnackBar) {}

  ngOnInit() {
      this.getAllPosts();
  }

  getAllPosts() {
      console.log("Fetching posts...");
      this.postService.getAllPosts().subscribe(
          res => {
              console.log("API Response:", res);
              this.allPosts = res.map((post: { postedBy: string; }) => ({
                  ...post,
                  avatar: `assets/img/avatar${post.postedBy}.jpg`
              }));
              this.filteredPosts = [...this.allPosts];
              this.totalItems = this.filteredPosts.length;
              this.totalPages = Math.ceil(this.totalItems / this.pageSize);
              this.applyPagination();
          },
          error => {
              console.error("API Error:", error);
              this.snackBar.open("Something went wrong!!", "Close", { duration: 3000 });
          }
      );
  }

  applyPagination(): void {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.displayedPosts = this.filteredPosts.slice(start, end);
      this.totalItems = this.filteredPosts.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      if (this.displayedPosts.length === 0 && this.currentPage > 1) {
          this.currentPage--;
          this.applyPagination();
      }
  }

  filterPosts(): void {
      if (!this.searchTerm.trim()) {
          this.filteredPosts = [...this.allPosts];
      } else {
          const term = this.searchTerm.toLowerCase();
          this.filteredPosts = this.allPosts.filter(post =>
              post.title.toLowerCase().includes(term)
          );
      }
      this.currentPage = 1;
      this.applySortFilter();
      this.applyPagination();
  }

  applySortFilter(): void {
      if (this.sortFilter === 'none') {
          this.filteredPosts = [...this.allPosts];
          if (this.searchTerm.trim()) {
              this.filterPosts();
          }
      } else if (this.sortFilter === 'likes') {
          this.filteredPosts.sort((a, b) => b.likeCount - a.likeCount);
      } else if (this.sortFilter === 'views') {
          this.filteredPosts.sort((a, b) => b.viewCount - a.viewCount);
      }
      this.currentPage = 1;
      this.applyPagination();
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

  changePage(page: number): void {
      if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
          this.applyPagination();
      }
  }
  
}
