import { Component } from '@angular/core';
import { Candidate } from 'src/app/models/Candidate';
import { CandidateService } from 'src/app/Services/candidate.service';

@Component({
  selector: 'app-candidat-list',
  templateUrl: './candidat-list.component.html',
  styleUrls: ['./candidat-list.component.css']
})
export class CandidatListComponent {
  candidates: Candidate[] = [];

  constructor(private candidateService: CandidateService) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.candidateService.getCandidates().subscribe({
      next: (data) => {
        this.candidates = data;
        this.candidates.forEach(candidate => {
          if (candidate.resumeUrl && candidate.resumeUrl.endsWith('...')) {
            this.candidateService.getCandidateResume(candidate.id).subscribe({
              next: (fullResume) => candidate.resumeUrl = fullResume,
              error: (err) => console.error('Resume fetch error:', err),
            });
          }
        });
      },
      error: (err) => console.error('Error fetching candidates:', err),
    });
  }

  deleteCandidate(id: number): void {
    if (confirm('Are you sure?')) {
      this.candidateService.deleteCandidate(id).subscribe({
        next: () => this.loadCandidates(),
        error: (err) => console.error('Delete error:', err),
      });
    }
  }

}
