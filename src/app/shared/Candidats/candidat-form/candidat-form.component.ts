import { Component } from '@angular/core';
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
export class CandidatFormComponent {
  candidate: Candidate = new Candidate();
  jobs: Job[] = [];
  isEditMode: boolean = false;

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadJobs();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.candidateService.getCandidateById(+id).subscribe({
        next: (data) => {
          console.log('✏️ Editing Candidate:', JSON.stringify(data, null, 2));
          this.candidate = data;
          if (this.candidate.applicationDate) {
            this.candidate.applicationDate = new Date(this.candidate.applicationDate).toISOString().slice(0, 16);
          }
        },
        error: (err) => console.error('❌ Error fetching candidate:', err),
      });
    }
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        // Set default jobId if jobs exist and candidate.jobId is unset
        if (this.jobs.length > 0 && !this.candidate.jobId) {
          this.candidate.jobId = this.jobs[0].jobId;
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
      const reader = new FileReader();
      reader.onload = () => {
        this.candidate.resumeUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (!this.candidate.jobId) {
      alert('Please select a job.');
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
        next: () => this.router.navigate(['/candidates']),
        error: (err) => console.error('Update error:', err),
      });
    } else {
      console.log('➕ Creating a new candidate');
      this.candidateService.createCandidate(candidateData).subscribe({
        next: () => this.router.navigate(['/candidates']),
        error: (err) => console.error('Create error:', err),
      });
    }
  }
}