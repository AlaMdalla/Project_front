import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
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
  candidate: Candidate = {
    id: undefined,  // Ensure it's undefined initially
    email: '',
    phone: '',
    resumeUrl: '',
    applicationDate: '',
    status: 'Pending',
    jobId: null
  };

  jobs: Job[] = [];
  isEditMode: boolean = false;

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
          console.log('✏️ Editing Candidate:', JSON.stringify(data, null, 2));
          
          // 🔥 FIX: Convert applicationDate to correct format
          if (data.applicationDate) {
            const date = new Date(data.applicationDate);
            data.applicationDate = date.toISOString().slice(0, 16); // Keep "yyyy-MM-ddThh:mm"
          }
  
          this.candidate = data;
        },
        error: (err) => console.error('❌ Error fetching candidate:', err),
      });
    }
  }
  

  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;
      },
      error: (err) => console.error('❌ Error fetching jobs:', err),
    });
  }

  onSubmit(): void {
    const formattedDate = this.candidate.applicationDate
      ? new Date(this.candidate.applicationDate).toISOString().slice(0, 16)
      : '';
  
      const candidateData = {
        id: this.candidate.id,
        email: this.candidate.email,
        phone: this.candidate.phone,
        resumeUrl: this.candidate.resumeUrl,
        applicationDate: this.candidate.applicationDate,
        status: this.candidate.status,
        jobId: this.candidate.jobId 
      };
      
  
  
    if (this.isEditMode && this.candidate.id) {
      console.log("✏️ Updating candidate with ID:", this.candidate.id);
      this.candidateService.updateCandidate(this.candidate.id, candidateData).subscribe({
        next: () => {
          this.router.navigate(['/candidates']);
        },
      });
    } else {
      console.log("➕ Creating a new candidate");
      this.candidateService.createCandidate(candidateData).subscribe({
        next: () => this.router.navigate(['/candidates']),
      });
    }
  }
  
  
}
