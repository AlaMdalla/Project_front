import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Candidate } from 'src/app/models/Candidate';
import { Job } from 'src/app/models/Job';
import { CandidateService } from 'src/app/Services/candidate.service';
import { JobService } from 'src/app/Services/job.service';
@Component({
  selector: 'app-apply-job',
  templateUrl: './apply-job.component.html',
  styleUrls: ['./apply-job.component.css']
})
export class ApplyJobComponent {
  candidate: Candidate = new Candidate();
  jobs: Job[] = [];
  job!: Job ;

  isEditMode: boolean = false;
  jobId: number | null = null;
  selectedJobTitle: string | null = null;

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadJobs();

    // Check if 'id' parameter exists for editing an existing candidate
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.jobService.getJobById(+id).subscribe({
        next: (data) => {
          this.jobId = +id;  // Using the unary plus operator to convert string to number
          this.job = data;
         this.selectedJobTitle=this.job.title
         console.log(this.selectedJobTitle)
        },
        error: (err) => console.error('❌ Error fetching candidate:', err),
      });
      
    }

    // Capture the jobId from route params if available
    this.route.params.subscribe(params => {
      if (params['jobId']) {
        this.jobId = +params['jobId'];  // Convert the jobId to a number if it's passed
        console.log('Job ID from route:', this.jobId);
      } else {
        this.jobId = null;  // No jobId passed, handle as a generic new candidate
      }
    });
  }

  loadJobs(): void {
    // Fetch available jobs from the job service
    this.jobService.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;

        // If no job is selected and there are jobs, select the first one
        if (this.jobs.length > 0 && !this.candidate.jobId) {
          if (this.jobId) {
            
            this.candidate.jobId = this.jobId;
            this.selectedJobTitle = this.jobs[0].title;
            // If jobId is passed in the URL, set it
          } else {
            this.candidate.jobId = this.jobs[0].jobId; // Set the first job by default
          }
        }
      },
      error: (err) => console.error('❌ Error fetching jobs:', err),
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('Resume too large! Max 5MB.');
        return;
      }
      this.candidateService.uploadResume(file).subscribe({
        next: (url) => {
          this.candidate.resumeUrl = url; // Set the returned URL
          console.log('Resume uploaded, URL:', url);
        },
        error: (err) => console.error('Error uploading resume:', err),
      });
    }
  }

  onSubmit(): void {
    // Validate the jobId and resumeUrl
    if (!this.candidate.jobId) {
      alert('Please select a job.');
      return;
    }
    if (!this.candidate.resumeUrl) {
      alert('Please upload a resume.');
      return;
    }

    const candidateData = {
      id: this.isEditMode ? this.candidate.id : undefined,
      email: this.candidate.email,
      phone: this.candidate.phone,
      resumeUrl: this.candidate.resumeUrl,
      applicationDate: this.candidate.applicationDate ? new Date(this.candidate.applicationDate).toISOString() : null,
      status: this.candidate.status,
      jobId: this.candidate.jobId
    };

    console.log('Payload sent:', JSON.stringify(candidateData, null, 2));

    if (this.isEditMode && this.candidate.id) {
      console.log('✏️ Updating candidate with ID:', this.candidate.id);
      this.candidateService.updateCandidate(this.candidate.id, candidateData).subscribe({
        next: () => this.router.navigate(['/candidates']), // Navigate to candidates list after update
        error: (err) => console.error('Update error:', err),
      });
    } else {
      console.log('➕ Creating a new candidate');
      this.candidateService.createCandidate(candidateData).subscribe({
        next: () => this.router.navigate(['/candidates']), // Navigate to candidates list after create
        error: (err) => console.error('Create error:', err),
      });
    }
  }
}
