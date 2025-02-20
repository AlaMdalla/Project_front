import { Component } from '@angular/core';
import { Job } from 'src/app/models/Job';
import { JobService } from 'src/app/Services/job.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent {
  jobs: Job[] = [];

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadJobs();
  }
  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;
      },
      error: (err) => {
        alert(`Error: ${err.message}`);
      },
    });
  }
  
  
  

  deleteJob(id: number): void {
    if (confirm('Are you sure you want to delete this job?')) {
      this.jobService.deleteJob(id).subscribe(() => this.loadJobs());
    }
  }
}
