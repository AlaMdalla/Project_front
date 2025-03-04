import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Competition } from 'src/app/models/Competition';
import { CompetionService } from 'src/app/Services/competion.service';

@Component({
    selector: 'app-list-competition',
    templateUrl: './list-competition.component.html',
    styleUrls: ['./list-competition.component.css']
})
export class ListCompetitionComponent implements OnInit {
    competitions: Competition[] = [];
    displayedCompetitions: Competition[] = [];
    filteredCompetitions: Competition[] = [];
    currentPage: number = 1;
    pageSize: number = 2;
    totalItems: number = 0;
    totalPages: number = 0;
    searchTerm: string = '';
    sortColumnName: any;
    sortDirection: string = 'asc';

    constructor(
        private competionService: CompetionService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.competionService.getCompetitions().subscribe(data => {
            this.competitions = data;
            this.filteredCompetitions = [...this.competitions];
            this.totalItems = this.filteredCompetitions.length;
            this.totalPages = Math.ceil(this.totalItems / this.pageSize);
            this.applyPagination();
        });
    }

    applyPagination(): void {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.displayedCompetitions = this.filteredCompetitions.slice(start, end);
        this.totalItems = this.filteredCompetitions.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        if (this.displayedCompetitions.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            this.applyPagination();
        }
    }

    filterCompetitions(): void {
        if (!this.searchTerm.trim()) {
            this.filteredCompetitions = [...this.competitions];
        } else {
            const term = this.searchTerm.toLowerCase();
            this.filteredCompetitions = this.competitions.filter(competition =>
                competition.title.toLowerCase().includes(term)
            );
        }
        this.currentPage = 1;
        if (this.sortColumnName) {
            this.sortColumn(this.sortColumnName);
        }
        this.applyPagination();
    }

    sortColumn(columnName: keyof Competition): void {
        if (this.sortColumnName === columnName) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumnName = columnName;
            this.sortDirection = 'asc';
        }

        this.filteredCompetitions.sort((a, b) => {
            const valueA = a[columnName].toString().toLowerCase();
            const valueB = b[columnName].toString().toLowerCase();
            if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        this.applyPagination();
    }

    editCompetition(id: number) {
        this.router.navigate(['/Competition/edit', id]);
    }

    deleteCompetition(id: number) {
        if (confirm('Are you sure you want to delete this competition?')) {
            this.competionService.deleteCompetitionById(id).subscribe(
                res => {
                    console.log("res", res);
                    this.competitions = this.competitions.filter(c => c.id !== id);
                    this.filteredCompetitions = this.filteredCompetitions.filter(c => c.id !== id);
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
