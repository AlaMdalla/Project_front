import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from 'src/app/models/Job';
import { JobService } from 'src/app/Services/job.service';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.css']
})
export class JobFormComponent implements OnInit {
  job: Job = new Job();

  constructor(
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.jobService.getJobById(+id).subscribe({
        next: (data) => (this.job = data),
        error: (err) => {
          console.error('Error fetching job:', err);
          this.router.navigate(['/jobs']); // Redirect on error
        }
      });
    }
    // Set default status if creating a new job
    if (!this.job.status) {
      this.job.status = 'Open';
    }
  }

  saveJob(): void {
    if (this.job.jobId) {
      this.jobService.updateJob(this.job.jobId, this.job).subscribe({
        next: () => this.router.navigate(['/jobs']),
        error: (err) => console.error('Error updating job:', err)
      });
    } else {
      this.jobService.createJob(this.job).subscribe({
        next: () => this.router.navigate(['/jobs']),
        error: (err) => console.error('Error creating job:', err)
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/jobs']);
  }
}