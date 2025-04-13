import { Component } from '@angular/core';
import { Candidate } from 'src/app/models/Candidate';
import { CandidateService } from 'src/app/Services/candidate.service';
import { JobService } from 'src/app/Services/job.service';

@Component({
  selector: 'app-candidat-list',
  templateUrl: './candidat-list.component.html',
  styleUrls: ['./candidat-list.component.css']
})
export class CandidatListComponent {
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  selectedJobId: number | null = null;
  fitResults: { [candidateId: number]: { score: number, reasoning: string[] } } = {};
  displayedCandidates: Candidate[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;
  searchTerm: string = '';
  sortColumnName: any;
  sortDirection: string = 'asc';
  private baseUrl = 'c:';
  jobs: any[] = [];

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.loadCandidates();
    this.loadJobs();
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
          console.log('Resume URL for candidate', candidate.id, ':', this.getResumeUrl(candidate.resumeUrl));
        });
      },
      error: (err) => console.error('Error fetching candidates:', err),
    });
  }

  getResumeUrl(resumeUrl: string): string {
    let transformedUrl = resumeUrl;
    // If it’s a file URL, extract the relative path
    if (transformedUrl.startsWith('file:///')) {
      const filePathIndex = transformedUrl.indexOf('/attachments/');
      if (filePathIndex !== -1) {
        transformedUrl = transformedUrl.substring(filePathIndex); // e.g., "/attachments/1744209178258_attestationdestage.pdf"
      } else {
        transformedUrl = transformedUrl.substring(7); // Fallback: remove "file:///"
      }
    }
    // Use HTTP base URL
    const url = `http://localhost:8000${transformedUrl}`;
    console.log('Generated Resume URL:', url);
    return url;
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

  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;
      },
      error: (err) => console.error('Error fetching jobs:', err),
    });
  }

 calculateFit(candidateId: number): void {
  console.log('Calculate Fit clicked for candidate ID:', candidateId); // Debug: Confirm click
  console.log('Selected Job ID:', this.selectedJobId); // Debug: Confirm job selection

  if (!this.selectedJobId) {
    console.log('No job selected, exiting.');
    return;
  }

  const candidate = this.candidates.find(c => c.id === candidateId);
  const job = this.jobs.find(j => j.jobId === this.selectedJobId);
  console.log('Candidate:', candidate); // Debug: Check candidate data
  console.log('Job:', job); // Debug: Check job data

  if (!candidate || !job) {
    console.log('Candidate or job not found.');
    return;
  }

  let score = 0;
  const reasoning: string[] = [];

  // Job title match (70% of score)
  const candidateJobTitle = candidate.jobTitle || ''; // Default to empty string if undefined
  const jobTitle = job.title || ''; // Default to empty string if undefined
  console.log('Comparing titles:', candidateJobTitle, 'vs', jobTitle); // Debug: Check titles
  if (candidateJobTitle.toLowerCase() === jobTitle.toLowerCase() && candidateJobTitle) {
    score += 70;
    reasoning.push("Job title match: +70");
  } else {
    reasoning.push("Job title mismatch: 0");
  }

  // Status (30% of score)
  console.log('Candidate status:', candidate.status); // Debug: Check status
  if (candidate.status === "Hired" || candidate.status === "Interview Scheduled") {
    score += 30;
    reasoning.push("Status promising: +30");
  } else {
    reasoning.push("Status neutral: 0");
  }

  console.log('Calculated score:', score, 'Reasoning:', reasoning); // Debug: Check result
  this.fitResults[candidateId] = { score, reasoning };
  console.log('fitResults updated:', this.fitResults); // Debug: Confirm update
}
}