import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Candidate } from 'src/app/models/Candidate';
import { CandidateService } from 'src/app/Services/candidate.service';
import { JobService } from 'src/app/Services/job.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-candidat-list',
  templateUrl: './candidat-list.component.html',
  styleUrls: ['./candidat-list.component.css']
})
export class CandidatListComponent implements AfterViewInit {
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
  sortColumnName: keyof Candidate | null = null;
  sortDirection: string = 'asc';
  private baseUrl = 'http://localhost:8560';
  jobs: any[] = [];
  statusOptions = ['applied', 'in interview', 'accepted', 'rejected'];

  @ViewChild('candidateChart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.loadCandidates();
    this.loadJobs();
  }

  ngAfterViewInit(): void {
    this.updateChart();
  }

  loadCandidates(): void {
    this.candidateService.getCandidates().subscribe({
      next: (data) => {
        this.candidates = data;
        this.filteredCandidates = [...data];
        this.totalItems = data.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.applyPagination();
        this.updateChart();
      },
      error: (err) => console.error('Error fetching candidates:', err),
    });
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        this.updateChart();
      },
      error: (err) => console.error('Error fetching jobs:', err),
    });
  }

  private updateChart(): void {
    if (!this.chartCanvas || !this.candidates.length) return;

    const { labels, data } = this.getChartData();
    if (!labels.length) return;

    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }

    const colors = [
      '#3b82f6', // Slate blue
      '#2dd4bf', // Teal
      '#f43f5e', // Rose
      '#fbbf24', // Amber
      '#a855f7', // Purple
      '#22c55e', // Green
      '#f97316', // Orange
    ];

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Candidates per Job',
          data,
          backgroundColor: labels.map((_, i) => colors[i % colors.length] + '80'),
          borderColor: labels.map((_, i) => colors[i % colors.length]),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Candidates' } },
          x: { title: { display: true, text: 'Jobs' } }
        },
        plugins: { title: { display: true, text: 'Candidate Applications by Job' } }
      }
    });
  }

  private getChartData(): { labels: string[], data: number[] } {
    const countMap: { [key: string]: number } = {};
    this.candidates.forEach(candidate => {
      const key = candidate.jobTitle || 'Unspecified';
      countMap[key] = (countMap[key] || 0) + 1;
    });
    return {
      labels: Object.keys(countMap),
      data: Object.values(countMap)
    };
  }

  getResumeUrl(resumeUrl: string): string {
    return `${this.baseUrl}/job/api/candidates${resumeUrl}`;
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
    this.filteredCandidates = this.searchTerm.trim()
      ? this.candidates.filter(c => c.email.toLowerCase().includes(this.searchTerm.toLowerCase()))
      : [...this.candidates];
    this.currentPage = 1;
    if (this.sortColumnName) this.sortColumn(this.sortColumnName);
    this.applyPagination();
    this.updateChart();
  }

  sortColumn(columnName: keyof Candidate): void {
    this.sortDirection = this.sortColumnName === columnName && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortColumnName = columnName;
    this.filteredCandidates.sort((a, b) => {
      const valueA = (a[columnName]?.toString().toLowerCase() || '');
      const valueB = (b[columnName]?.toString().toLowerCase() || '');
      return this.sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });
    this.applyPagination();
    this.updateChart();
  }

  deleteCandidate(id: number): void {
    if (confirm('Are you sure you want to delete this candidate?')) {
      this.candidateService.deleteCandidate(id).subscribe({
        next: () => {
          this.candidates = this.candidates.filter(c => c.id !== id);
          this.filterCandidates();
        },
        error: (err) => console.error('Delete error:', err),
      });
    }
  }

  updateStatus(candidate: Candidate, newStatus: string): void {
    if (!newStatus) return; // Ignore empty selection
    const updatedCandidate = {
      email: candidate.email,
      phone: candidate.phone,
      resumeUrl: candidate.resumeUrl,
      applicationDate: candidate.applicationDate,
      status: newStatus,
      jobId: candidate.jobId
    };
    this.candidateService.updateCandidate(candidate.id!, updatedCandidate).subscribe({
      next: () => {
        candidate.status = newStatus;
        alert(`Status updated to "${newStatus}" for ${candidate.email}. Email sent.`);
        this.loadCandidates(); // Refresh to ensure consistency
      },
      error: (err) => {
        console.error('Status update error:', err);
        alert('Failed to update status. Please try again.');
      }
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyPagination();
    }
  }

  calculateFit(candidateId: number): void {
    if (!this.selectedJobId) return;
    const candidate = this.candidates.find(c => c.id === candidateId);
    const job = this.jobs.find(j => j.jobId === this.selectedJobId);
    if (!candidate || !job) return;
    let score = 0;
    const reasoning: string[] = [];
    const candidateJobTitle = candidate.jobTitle || '';
    const jobTitle = job.title || '';
    if (candidateJobTitle.toLowerCase() === jobTitle.toLowerCase() && candidateJobTitle) {
      score += 70;
      reasoning.push("Job title match: +70");
    } else {
      reasoning.push("Job title mismatch: 0");
    }
    if (candidate.status === "accepted" || candidate.status === "in interview") {
      score += 30;
      reasoning.push("Status promising: +30");
    } else {
      reasoning.push("Status neutral: 0");
    }
    this.fitResults[candidateId] = { score, reasoning };
    this.fitResults = { ...this.fitResults };
  }
}