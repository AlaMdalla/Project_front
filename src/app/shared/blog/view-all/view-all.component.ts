import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PostService } from 'src/app/Services/post.service';
import { UsersService } from 'src/app/Services/users.service';

interface Post {
    avatar: any;
    id: number;
    title: string;
    category: string;
    content: string;
    img: string | null;
    date: Date;
    likeCount: number;
    laught: number;
    angry: number;
    viewCount: number;
    userId: number;
    name?: string; // Renamed from 'username' to 'name'
}

@Component({
    selector: 'app-view-all',
    templateUrl: './view-all.component.html',
    styleUrls: ['./view-all.component.css']
})
export class ViewAllComponent implements OnInit {
    allPosts: Post[] = [];
    filteredPosts: Post[] = [];
    displayedPosts: Post[] = [];
    currentPage: number = 1;
    pageSize: number = 6;
    totalItems: number = 0;
    totalPages: number = 0;
    searchTerm: string = '';
    sortFilter: string = 'none';
    userId?: number;
    userMap: { [key: number]: string } = {}; // Map of userId to username

    constructor(
        private postService: PostService,
        private snackBar: MatSnackBar,
        private usersService: UsersService,
        private router: Router
    ) {}

    async ngOnInit() {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const profileInfo = await this.usersService.getYourProfile(token);
                this.userId = profileInfo.ourUsers.id;
                console.log('User ID:', this.userId);
    
                // Fetch all users to create a userId-to-name mapping
                const usersResponse = await this.usersService.getAllUsers(token);
                console.log('Users Response:', usersResponse); // Add this log
                const users = usersResponse; // Remove .ourUsers
                if (users && Array.isArray(users)) {
                    users.forEach((user: any) => {
                        this.userMap[user.id] = user.name;
                    });
                } else {
                    console.error('Users data is not an array or is undefined:', users);
                }
                console.log('User Map:', this.userMap);
            }
        } catch (error: any) {
            console.log('Error fetching user profile or users:', error.message);
            this.snackBar.open("Error fetching user data!", "Close", { duration: 3000 });
        }
    
        this.getAllPosts();
    }
    
    getAllPosts() {
        this.postService.getAllPosts().subscribe({
          next: async (res: Post[]) => {
            console.log('Raw response:', res);
            this.allPosts = [];
            for (const post of res) {
              let name = 'Unknown User';
              try {
                const userResponse = await this.usersService.getOwnUsersById(post.userId.toString());
                console.log('User Response for userId', post.userId, ':', userResponse);
                name = userResponse.ourUsers?.name || 'Unknown User';
              } catch (error) {
                console.error(`Error fetching user for post ${post.id}:`, error);
              }
              this.allPosts.push({
                ...post,
                name
              });
            }
            this.filteredPosts = [...this.allPosts];
            this.totalItems = this.filteredPosts.length;
            this.totalPages = Math.ceil(this.totalItems / this.pageSize);
            this.applyPagination();
          },
          error: (error) => {
            console.error('Error fetching posts:', error);
            if (error.status === 403 || error.status === 401) {
              this.snackBar.open("Please log in to view posts", "Close", { duration: 3000 });
              localStorage.removeItem('token');
              window.location.href = '/login'; // Use window.location.href to ensure navigation
            } else {
              this.snackBar.open("Something went wrong while fetching posts!", "Close", { duration: 3000 });
            }
          }
        });
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
            this.filteredPosts.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        } else if (this.sortFilter === 'views') {
            this.filteredPosts.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        }
        this.currentPage = 1;
        this.applyPagination();
    }

    deletePost(postId: number) {
        if (!this.userId) {
            this.snackBar.open("Vous devez être connecté pour supprimer un post", "Close", { duration: 3000 });
            return;
        }

        if (confirm("Are you sure you want to delete this post?")) {
            this.postService.deletePostById(this.userId, postId).subscribe({
                next: () => {
                    this.snackBar.open("Post deleted successfully!", "Close", { duration: 3000 });
                    this.getAllPosts();
                },
                error: (error) => {
                    console.error('Error deleting post:', error);
                    if (error.status === 403) {
                        this.snackBar.open("Vous n'êtes pas autorisé à supprimer ce post", "Close", { duration: 3000 });
                    } else {
                        this.snackBar.open("Something went wrong!!", "Close", { duration: 3000 });
                    }
                }
            });
        }
    }

    changePage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.applyPagination();
        }
    }
}