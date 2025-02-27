import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from 'src/app/models/Job';
import { JobService } from 'src/app/Services/job.service';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.css']
})
export class JobFormComponent {
  job: Job = new Job();

  constructor(
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.jobService.getJobById(+id).subscribe((data) => (this.job = data));
    }
  }

  saveJob(): void {
    // Only proceed if the form is valid (handled by the template button [disabled])
    if (this.job.jobId) {
      this.jobService.updateJob(this.job.jobId, this.job).subscribe(() => {
        this.router.navigate(['/jobs']);
      });
    } else {
      this.jobService.createJob(this.job).subscribe(() => {
        this.router.navigate(['/jobs']);
      });
    }
  }
}