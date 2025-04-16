import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Candidate } from 'src/app/models/Candidate';
import { Job } from 'src/app/models/Job';
import { CandidateService } from 'src/app/Services/candidate.service';
import { JobService } from 'src/app/Services/job.service';

@Component({
  selector: 'app-candidat-form',
  templateUrl: './candidat-form.component.html',
  styleUrls: ['./candidat-form.component.css']
})
export class CandidateFormComponent implements OnInit {
  candidate: Candidate = new Candidate();
  jobs: Job[] = [];
  isEditMode: boolean = false;
  jobId: number | null = null;
  selectedJobTitle: string | null = null;
  errorMessage: string = '';

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadJobs();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.candidateService.getCandidateById(+id).subscribe({
        next: (data) => {
          this.candidate = data;
          if (this.candidate.applicationDate) {
            this.candidate.applicationDate = new Date(this.candidate.applicationDate).toISOString().slice(0, 16);
          }
        },
        error: (err) => {
          console.error('❌ Error fetching candidate:', err);
          this.showError('Failed to load candidate data.');
        },
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
            this.selectedJobTitle = this.jobs.find(job => job.jobId === this.jobId)?.title || null;
          } else {
            this.candidate.jobId = this.jobs[0].jobId;
            this.selectedJobTitle = this.jobs[0].title;
          }
        }
      },
      error: (err) => {
        console.error('❌ Error fetching jobs:', err);
        this.showError('Failed to load jobs.');
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        this.showError('Resume too large! Max 5MB.');
        return;
      }
      this.candidateService.uploadResume(file).subscribe({
        next: (url) => {
          this.candidate.resumeUrl = url;
          console.log('Resume uploaded, URL:', url);
        },
        error: (err) => {
          console.error('Error uploading resume:', err);
          this.showError('Failed to upload resume.');
        },
      });
    }
  }

  showError(mess: string): void {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  onSubmit(): void {
    if (!this.candidate.jobId) {
      this.showError('Please select a job.');
      return;
    }
    if (!this.candidate.resumeUrl) {
      this.showError('Please upload a resume.');
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
        next: () => {
          alert("Candidate updated successfully! Email and SMS sent to ${candidateData.email} and ${candidateData.phone} from PidevFinal Team.");
          this.router.navigate(['/candidates']);
        },
        error: (err) => {
          console.error('Update error:', err);
          this.showError('Error updating candidate. Please try again.');
        },
      });
    } else {
      console.log('➕ Creating a new candidate');
      this.candidateService.createCandidate(candidateData).subscribe({
        next: () => {
          alert("Application submitted successfully! Email and SMS sent to ${candidateData.email} and ${candidateData.phone} from PidevFinal Team.");
          this.router.navigate(['/candidates']);
        },
        error: (err) => {
          console.error('Create error:', err);
          this.showError('Error submitting application. Please try again.');
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/candidates']);
  }
}