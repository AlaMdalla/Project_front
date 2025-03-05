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
              this.jobService.getJobById(+id).subscribe({
                  next: (data) => {
                      this.job = data;
                  },
                  error: (err) => console.error('Error fetching job:', err),
              });
          }
      }
  
      onFileSelected(event: Event): void {
          const input = event.target as HTMLInputElement;
          if (input.files && input.files[0]) {
              const file = input.files[0];
              if (file.size > 5 * 1024 * 1024) {
                  alert('Image too large! Max 5MB.');
                  return;
              }
              const reader = new FileReader();
              reader.onload = () => {
                  this.job.image = reader.result as string;
              };
              reader.readAsDataURL(file);
          }
      }
  
      onDateChange(dateValue: string): void {
          this.job.postedDate = dateValue ? new Date(dateValue) : new Date();
      }
  
      saveJob(): void {
          const jobToSave = { ...this.job };
          if (this.job.jobId) {
              this.jobService.updateJob(this.job.jobId, jobToSave).subscribe({
                  next: () => this.router.navigate(['/jobs']),
                  error: (err) => console.error('Error updating job:', err),
              });
          } else {
              this.jobService.createJob(jobToSave).subscribe({
                  next: () => this.router.navigate(['/jobs']),
                  error: (err) => console.error('Error creating job:', err),
              });
          }
      }
  
      cancel(): void {
          this.router.navigate(['/jobs']);
      }
  }

