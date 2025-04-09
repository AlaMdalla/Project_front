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
    img: string | null;
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
    filteredPosts: Post[] = [];
    displayedPosts: Post[] = [];
    currentPage: number = 1;
    pageSize: number = 5;
    totalItems: number = 0;
    totalPages: number = 0;
    searchTerm: string = '';
    sortFilter: string = 'none';

    constructor(private postService: PostService, private snackBar: MatSnackBar) {}

    ngOnInit() {
        this.getAllPosts();
    }

    getAllPosts() {
        this.postService.getAllPosts().subscribe({
            next: (res: Post[]) => {
                console.log('Raw response:', res);
                this.allPosts = res.map(post => {
                    console.log('Post img value:', post.img);
                    return {
                        ...post,
                        avatar: `assets/img/avatar${post.postedBy}.jpg`
                    };
                });
                this.filteredPosts = [...this.allPosts];
                this.totalItems = this.filteredPosts.length;
                this.totalPages = Math.ceil(this.totalItems / this.pageSize);
                this.applyPagination();
            },
            error: (error) => {
                console.error('Error fetching posts:', error);
                this.snackBar.open("Something went wrong!!", "Close", { duration: 3000 });
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
        if (confirm("Are you sure you want to delete this post?")) {
            this.postService.deletePostById(postId).subscribe({
                next: () => {
                    this.snackBar.open("Post deleted successfully!", "Close", { duration: 3000 });
                    this.getAllPosts();
                },
                error: (error) => {
                    console.error('Error deleting post:', error);
                    this.snackBar.open("Something went wrong!!", "Close", { duration: 3000 });
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