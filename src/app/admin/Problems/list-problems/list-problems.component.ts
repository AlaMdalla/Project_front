import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Problem } from 'src/app/models/Problem';
import { PoblemService } from 'src/app/Services/poblem.service';

@Component({
    selector: 'app-list-problems',
    templateUrl: './list-problems.component.html',
    styleUrls: ['./list-problems.component.css']
})
export class ListProblemsComponent implements OnInit {
    problems: Problem[] = [];
    displayedProblems: Problem[] = []; // Subset of problems to display
    filteredProblems: Problem[] = []; // Filtered problems before pagination
    currentPage: number = 1;
    pageSize: number = 2;
    totalItems: number = 0;
    totalPages: number = 0;
    searchTerm: string = ''; // Bound to the filter input
    sortColumnName: any; // Current column being sorted, restricted to Problem keys
    sortDirection: string = 'asc'; // Current sort direction ('asc' or 'desc')

    constructor(
        private problemsS: PoblemService, // Fixed typo in service name
        private router: Router
    ) {}

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.problemsS.getProblems().subscribe(data => {
            this.problems = data;
            this.filteredProblems = [...this.problems]; // Initialize filteredProblems
            this.totalItems = this.filteredProblems.length;
            this.totalPages = Math.ceil(this.totalItems / this.pageSize);
            this.applyPagination();
        });
    }

    // Apply pagination to filtered problems
    applyPagination(): void {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.displayedProblems = this.filteredProblems.slice(start, end);
        this.totalItems = this.filteredProblems.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        if (this.displayedProblems.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            this.applyPagination();
        }
    }

    // Filter problems based on search term (only by title)
    filterProblems(): void {
        if (!this.searchTerm.trim()) {
            this.filteredProblems = [...this.problems];
        } else {
            const term = this.searchTerm.toLowerCase();
            this.filteredProblems = this.problems.filter(problem =>
                problem.title.toLowerCase().includes(term) // Filter only by title
            );
        }
        // Reset to first page after filtering
        this.currentPage = 1;
        // Reapply sorting after filtering if a column is sorted
        if (this.sortColumnName) {
            this.sortColumn(this.sortColumnName);
        }
        this.applyPagination();
    }

    // Sort problems by column
    sortColumn(columnName: keyof Problem): void {
        if (this.sortColumnName === columnName) {
            // Toggle direction if clicking the same column
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // Set new column and default to ascending
            this.sortColumnName = columnName;
            this.sortDirection = 'asc';
        }

        this.filteredProblems.sort((a, b) => {
            const valueA = a[columnName].toString().toLowerCase();
            const valueB = b[columnName].toString().toLowerCase();
            if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        // Reapply pagination after sorting
        this.applyPagination();
    }

    editProblem(id: number) {
        this.router.navigate(['/problem/edit', id]);
    }

    deleteProblem(id: number) {
        if (confirm('Are you sure you want to delete this problem?')) { // Fixed typo in message
            this.problemsS.deleteProblemById(id).subscribe(
                res => {
                    console.log("res", res);
                    this.problems = this.problems.filter(c => c.id !== id);
                    this.filteredProblems = this.filteredProblems.filter(c => c.id !== id);
                    this.applyPagination();
                },
                error => {
                    console.error(error);
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