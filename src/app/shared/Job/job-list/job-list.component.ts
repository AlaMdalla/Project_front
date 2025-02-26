import { Component, OnInit } from '@angular/core';
import { Job } from 'src/app/models/Job';
import { JobService } from 'src/app/Services/job.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];          // Original list of jobs
  filteredJobs: Job[] = [];  // Filtered list based on search
  searchTerm: string = '';   // Search input value

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        this.filteredJobs = data; // Initially, filtered list is the full list
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
        alert('Failed to load job listings. Please try again later.');
      }
    });
  }

  filterJobs(): void {
    if (!this.searchTerm) {
      this.filteredJobs = [...this.jobs]; // Reset to full list if search is empty
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredJobs = this.jobs.filter(job =>
      (job.title?.toLowerCase().includes(term) || '') ||
      (job.department?.toLowerCase().includes(term) || '') ||
      (job.location?.toLowerCase().includes(term) || '') ||
      (job.status?.toLowerCase().includes(term) || '') ||
      (job.description?.toLowerCase().includes(term) || '')
    );
  }

  apply(job: Job): void {
    // Placeholder for apply logic (e.g., redirect to application form)
    alert(`Applying for ${job.title}! (This is a placeholder action.)`);
  }

  deleteJob(id: number | undefined): void {
    if (!id) {
      alert('Invalid job ID.');
      return;
    }
    if (confirm('Are you sure you want to delete this job?')) {
      this.jobService.deleteJob(id).subscribe({
        next: () => {
          this.jobs = this.jobs.filter(job => job.jobId !== id);
          this.filterJobs(); // Re-filter after deletion
        },
        error: (err) => {
          console.error('Error deleting job:', err);
          alert('Failed to delete job. Please try again.');
        }
      });
    }
  }
}