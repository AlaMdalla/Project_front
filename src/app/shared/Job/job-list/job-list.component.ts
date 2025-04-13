import { Component } from '@angular/core';
import { Job } from 'src/app/models/Job';
import { JobService } from 'src/app/Services/job.service';
import { MatDialog } from '@angular/material/dialog';
import { JobPopupComponent } from '../job-popup/job-popup.component';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent {
  jobs: Job[] = [];

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
        // Updated popup logic
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

  deleteJob(id: number): void {
    if (confirm('Are you sure?')) {
      this.jobService.deleteJob(id).subscribe({
        next: () => this.loadJobs(),
        error: (err) => console.error('Delete error:', err),
      });
    }
  }

  getGoogleMapsUrl(location: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  }
}