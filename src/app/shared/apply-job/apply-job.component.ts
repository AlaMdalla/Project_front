import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Candidate } from 'src/app/models/Candidate';
import { Job } from 'src/app/models/Job';
import { CandidateService } from 'src/app/Services/candidate.service';
import { JobService } from 'src/app/Services/job.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-apply-job',
  templateUrl: './apply-job.component.html',
  styleUrls: ['./apply-job.component.css']
})
export class ApplyJobComponent {
  candidate: Candidate = new Candidate();
  jobs: Job[] = [];
  job!: Job;

  isEditMode: boolean = false;
  jobId: number | null = null;
  selectedJobTitle: string | null = null;
  profileInfo: any;

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private readonly userService: UsersService,
  ) {}

  async ngOnInit() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No Token Found');
      }

      this.profileInfo = await this.userService.getYourProfile(token);
      console.log("Profile info:", this.profileInfo);
      this.candidate.email = this.profileInfo.ourUsers.email;
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    }

    this.loadJobs();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.jobService.getJobById(+id).subscribe({
        next: (data) => {
          this.jobId = +id;
          this.job = data;
          this.selectedJobTitle = this.job.title;
          console.log('Job title:', this.selectedJobTitle);
        },
        error: (err) => console.error('❌ Error fetching job:', err),
      });
    }

    this.route.params.subscribe(params => {
      if (params['jobId']) {
        this.jobId = +params['jobId'];
        console.log('Job ID from route:', this.jobId);
      } else {
        this.jobId = null;
      }
    });
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        if (this.jobs.length > 0 && !this.candidate.jobId) {
          if (this.jobId) {
            this.candidate.jobId = this.jobId;
            this.selectedJobTitle = this.jobs.find(job => job.jobId === this.jobId)?.title || this.jobs[0].title;
          } else {
            this.candidate.jobId = this.jobs[0].jobId;
            this.selectedJobTitle = this.jobs[0].title;
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
          this.candidate.resumeUrl = url;
          console.log('Resume uploaded, URL:', url);
        },
        error: (err) => console.error('Error uploading resume:', err),
      });
    }
  }

  onSubmit(): void {
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
      applicationDate: this.candidate.applicationDate ? new Date(this.candidate.applicationDate).toISOString() : new Date().toISOString(),
      status: this.candidate.status || 'applied',
      jobId: this.candidate.jobId
    };

    console.log('Submitting candidate:', JSON.stringify(candidateData, null, 2));

    if (this.isEditMode && this.candidate.id) {
      console.log('✏️ Updating candidate ID:', this.candidate.id);
      this.candidateService.updateCandidate(this.candidate.id, candidateData).subscribe({
        next: () => this.router.navigate(['/candidates']),
        error: (err) => {
          console.error('Update error:', err);
          alert('Failed to update application. Please try again.');
        },
      });
    } else {
      console.log('➕ Creating candidate');
      this.candidateService.createCandidate(candidateData).subscribe({
        next: () => {
          alert('Application submitted successfully!');
          this.router.navigate(['/candidates']);
        },
        error: (err) => {
          console.error('Create error:', err);
          alert('Failed to submit application. Please try again.');
        },
      });
    }
  }
}