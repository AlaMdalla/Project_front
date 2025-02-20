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
    this.candidateService.getCandidates().subscribe({
      next: (data) => {
        this.candidates = data;
      },
      error: (err) => console.error('Error fetching candidates:', err)
    });
}


loadCandidates(): void {
  this.candidateService.getCandidates().subscribe((data) => {
    this.candidates = data;
  });
}

deleteCandidate(id: number | undefined): void {
  if (id === undefined || id === null || id <= 0) {
    return;
  }


  this.candidateService.deleteCandidate(id).subscribe({
    next: () => {
      confirm('Are you sure you want to delete this candidate?')
      this.candidates = this.candidates.filter(c => c.id !== id);
    },
  });
}


}
