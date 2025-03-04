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
    errorMessage: string = '';
    searchTerm: string = ''; // Bound to the filter input
    sortColumnName: string = ''; // Current column being sorted
    sortDirection: string = 'asc'; // Current sort direction ('asc' or 'desc')

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
                this.filteredUsers = [...this.users]; // Initialize filteredUsers
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
        // Reapply sorting after filtering
        if (this.sortColumnName) {
            this.sortColumn(this.sortColumnName);
        }
    }

    // Sort users by column
    sortColumn(columnName: string) {
        if (this.sortColumnName === columnName) {
            // Toggle direction if clicking the same column
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // Set new column and default to ascending
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
    }

    async deleteUser(userId: string) {
        const confirmDelete = confirm('Are you sure you want to delete this user?');
        if (confirmDelete) {
            try {
                const token: any = localStorage.getItem('token');
                await this.userService.deleteUser(userId, token);
                // Refresh the user list after deletion
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
            this.errorMessage = ''; // Clear the error message after the specified duration
        }, 3000);
    }
}