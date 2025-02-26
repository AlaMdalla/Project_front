import { Component, OnInit } from '@angular/core';
import { Candidate } from 'src/app/models/Candidate';
import { CandidateService } from 'src/app/Services/candidate.service';

@Component({
  selector: 'app-candidat-list',
  templateUrl: './candidat-list.component.html',
  styleUrls: ['./candidat-list.component.css']
})
export class CandidatListComponent implements OnInit {
  candidates: Candidate[] = [];          // Original list of candidates
  filteredCandidates: Candidate[] = [];  // Filtered list based on search
  searchTerm: string = '';               // Search input value

  constructor(private candidateService: CandidateService) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.candidateService.getCandidates().subscribe({
      next: (data) => {
        this.candidates = data;
        this.filteredCandidates = data; // Initially, filtered list is the full list
      },
      error: (err) => console.error('Error fetching candidates:', err)
    });
  }

  filterCandidates(): void {
    if (!this.searchTerm) {
      this.filteredCandidates = [...this.candidates]; // Reset to full list if search is empty
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredCandidates = this.candidates.filter(candidate =>
      (candidate.email?.toLowerCase().includes(term) || '') ||
      (candidate.phone?.toLowerCase().includes(term) || '') ||
      (candidate.status?.toLowerCase().includes(term) || '') ||
      (candidate.jobId?.toString().includes(term) || '')
    );
  }

  deleteCandidate(id: number | undefined): void {
    if (id === undefined || id === null || id <= 0) {
      console.warn('Invalid candidate ID:', id);
      return;
    }

    if (confirm('Are you sure you want to delete this candidate?')) {
      this.candidateService.deleteCandidate(id).subscribe({
        next: () => {
          this.candidates = this.candidates.filter(c => c.id !== id);
          this.filterCandidates(); // Re-filter after deletion
        },
        error: (err) => console.error('Error deleting candidate:', err)
      });
    }
  }
}