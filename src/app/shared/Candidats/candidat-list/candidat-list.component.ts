import { Component } from '@angular/core';
import { Candidate } from 'src/app/models/Candidate';
import { CandidateService } from 'src/app/Services/candidate.service';

@Component({
  selector: 'app-candidat-list',
  templateUrl: './candidat-list.component.html',
  styleUrls: ['./candidat-list.component.css']
})
export class CandidatListComponent {
  candidates: Candidate[] = [];
    filteredCandidates: Candidate[] = [];
    displayedCandidates: Candidate[] = [];
    currentPage: number = 1;
    pageSize: number = 5;
    totalItems: number = 0;
    totalPages: number = 0;
    searchTerm: string = '';
    sortColumnName: any;
    sortDirection: string = 'asc';
    private baseUrl = 'http://localhost:8081';
    constructor(private candidateService: CandidateService) {}

    ngOnInit(): void {
        this.loadCandidates();
    }

    loadCandidates(): void {
        this.candidateService.getCandidates().subscribe({
            next: (data) => {
                this.candidates = data;
                this.filteredCandidates = [...this.candidates];
                this.totalItems = this.filteredCandidates.length;
                this.totalPages = Math.ceil(this.totalItems / this.pageSize);
                this.applyPagination();

                this.candidates.forEach(candidate => {
                    if (candidate.resumeUrl && candidate.resumeUrl.endsWith('...')) {
                        this.candidateService.getCandidateResume(candidate.id).subscribe({
                            next: (fullResume) => candidate.resumeUrl = fullResume,
                            error: (err) => console.error('Resume fetch error:', err),
                        });
                    }
                });
            },
            error: (err) => console.error('Error fetching candidates:', err),
        });
    }
    getResumeUrl(resumeUrl: string): string {
      return `${this.baseUrl}${resumeUrl}`; 
    }
    applyPagination(): void {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.displayedCandidates = this.filteredCandidates.slice(start, end);
        this.totalItems = this.filteredCandidates.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        if (this.displayedCandidates.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            this.applyPagination();
        }
    }

    filterCandidates(): void {
        if (!this.searchTerm.trim()) {
            this.filteredCandidates = [...this.candidates];
        } else {
            const term = this.searchTerm.toLowerCase();
            this.filteredCandidates = this.candidates.filter(candidate =>
                candidate.email.toLowerCase().includes(term)
            );
        }
        this.currentPage = 1;
        if (this.sortColumnName) {
            this.sortColumn(this.sortColumnName);
        }
        this.applyPagination();
    }

    sortColumn(columnName: keyof Candidate): void {
        if (this.sortColumnName === columnName) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumnName = columnName;
            this.sortDirection = 'asc';
        }

        this.filteredCandidates.sort((a, b) => {
            const valueA = a[columnName]?.toString().toLowerCase() || '';
            const valueB = b[columnName]?.toString().toLowerCase() || '';
            if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        this.applyPagination();
    }

    deleteCandidate(id: number): void {
        if (confirm('Are you sure you want to delete this candidate?')) {
            this.candidateService.deleteCandidate(id).subscribe({
                next: () => {
                    this.candidates = this.candidates.filter(c => c.id !== id);
                    this.filteredCandidates = this.filteredCandidates.filter(c => c.id !== id);
                    this.applyPagination();
                },
                error: (err) => console.error('Delete error:', err),
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
