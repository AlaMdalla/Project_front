import { Component } from '@angular/core';
import { Job } from 'src/app/models/Job';
import { JobService } from 'src/app/Services/job.service';
import { MatDialog } from '@angular/material/dialog';
import { JobPopupComponent } from '../Job/job-popup/job-popup.component';

@Component({
  selector: 'app-listjobsadmin',
  templateUrl: './listjobsadmin.component.html',
  styleUrls: ['./listjobsadmin.component.css']
})
export class ListjobsadminComponent {
  jobs: Job[] = [];
  paginatedJobs: Job[] = [];

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private jobService: JobService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;

        this.jobs.forEach(job => {
          if (job.image && job.image.endsWith('...')) {
            this.jobService.getJobImage(job.jobId).subscribe({
              next: (fullImage) => job.image = fullImage,
              error: (err) => console.error('Image fetch error:', err),
            });
          }
        });

        // Pagination update
        this.updatePaginatedJobs();

        // Show popup if newest job is new
        if (this.jobs.length > 0) {
          const newestJob = this.jobs.reduce((prev, current) =>
            new Date(prev.postedDate) > new Date(current.postedDate) ? prev : current
          );
          const lastShownDate = localStorage.getItem('lastShownJobDate');
          const newestJobDate = new Date(newestJob.postedDate).toISOString();
          if (!lastShownDate || new Date(lastShownDate) < new Date(newestJobDate)) {
            this.dialog.open(JobPopupComponent, {
              width: '500px',
              data: newestJob
            });
            localStorage.setItem('lastShownJobDate', newestJobDate);
          }
        }
      },
      error: (err) => console.error('Jobs fetch error:', err),
    });
  }

  updatePaginatedJobs(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedJobs = this.jobs.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.jobs.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedJobs();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedJobs();
    }
  }

  deleteJob(id: number): void {
    if (confirm('Are you sure you want to delete this job?')) {
      this.jobService.deleteJob(id).subscribe({
        next: () => {
          this.loadJobs(); // Reload list
        },
        error: (err) => console.error('Delete error:', err),
      });
    }
  }

  getGoogleMapsUrl(location: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  }
}
