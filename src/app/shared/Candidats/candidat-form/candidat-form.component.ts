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
export class CandidatFormComponent implements OnInit {
  candidate: Candidate = {
    id: undefined,
    email: '',
    phone: '',
    resumeUrl: '',
    applicationDate: new Date().toISOString().slice(0, 16), // Default to now
    status: 'applied', // Default status
    jobId: null
  };

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
          if (data.applicationDate) {
            data.applicationDate = new Date(data.applicationDate).toISOString().slice(0, 16);
          }
          this.candidate = data;
        },
        error: (err) => {
          console.error('Error fetching candidate:', err);
          this.router.navigate(['/candidates']); // Redirect on error
        }
      });
    }
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
        alert('Failed to load job listings. Some features may be limited.');
      }
    });
  }

  onSubmit(): void {
    const candidateData: Candidate = {
      ...this.candidate,
      applicationDate: this.candidate.applicationDate // Already formatted by input
    };

    if (this.isEditMode && this.candidate.id) {
      this.candidateService.updateCandidate(this.candidate.id, candidateData).subscribe({
        next: () => this.router.navigate(['/candidates']),
        error: (err) => {
          console.error('Error updating candidate:', err);
          alert('Failed to update candidate. Please try again.');
        }
      });
    } else {
      this.candidateService.createCandidate(candidateData).subscribe({
        next: () => this.router.navigate(['/candidates']),
        error: (err) => {
          console.error('Error creating candidate:', err);
          alert('Failed to create candidate. Please try again.');
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/candidates']);
  }
}