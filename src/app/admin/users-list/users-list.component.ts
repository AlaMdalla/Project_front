import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from 'src/app/Services/users.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
    users: any[] = []; // Original user data
    filteredUsers: any[] = []; // Filtered and sorted user data
    paginatedUsers: any[] = []; // Users for the current page
    errorMessage: string = '';
    searchTerm: string = ''; // Bound to the filter input
    sortColumnName: string = ''; // Current column being sorted
    sortDirection: string = 'asc'; // Current sort direction ('asc' or 'desc')
    
    // Pagination properties
    currentPage: number = 1;
    pageSize: number = 4; // Number of users per page
    totalPages: number = 1;

    constructor(
        private readonly userService: UsersService,
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        this.loadUsers();
    }

    async loadUsers() {
        try {
            const token: any = localStorage.getItem('token');
            const response = await this.userService.getAllUsers(token);
            if (response && response.statusCode === 200 && response.ourUsersList) {
                this.users = response.ourUsersList;
                this.filteredUsers = [...this.users];
                this.updatePagination();
            } else {
                this.showError('No users found.');
            }
        } catch (error: any) {
            this.showError(error.message);
        }
    }

    // Filter users based on search term
    filterUsers() {
        if (!this.searchTerm.trim()) {
            this.filteredUsers = [...this.users];
        } else {
            const term = this.searchTerm.toLowerCase();
            this.filteredUsers = this.users.filter(user =>
                user.name.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term) ||
                user.city.toLowerCase().includes(term)
            );
        }
        // Reapply sorting and reset to first page
        if (this.sortColumnName) {
            this.sortColumn(this.sortColumnName);
        }
        this.currentPage = 1; // Reset to first page after filtering
        this.updatePagination();
    }

    // Sort users by column
    sortColumn(columnName: string) {
        if (this.sortColumnName === columnName) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumnName = columnName;
            this.sortDirection = 'asc';
        }

        this.filteredUsers.sort((a, b) => {
            const valueA = a[columnName].toString().toLowerCase();
            const valueB = b[columnName].toString().toLowerCase();
            if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        this.updatePagination();
    }

    // Update paginated users
    updatePagination() {
        this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
    }

    // Navigate to previous page
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePagination();
        }
    }

    // Navigate to next page
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePagination();
        }
    }

    async deleteUser(userId: string) {
        const confirmDelete = confirm('Are you sure you want to delete this user?');
        if (confirmDelete) {
            try {
                const token: any = localStorage.getItem('token');
                await this.userService.deleteUser(userId, token);
                this.loadUsers();
            } catch (error: any) {
                this.showError(error.message);
            }
        }
    }

    navigateToUpdate(userId: string) {
        this.router.navigate(['/update', userId]);
    }

    showError(message: string) {
        this.errorMessage = message;
        setTimeout(() => {
            this.errorMessage = '';
        }, 3000);
    }
}