import { Component, OnInit } from '@angular/core';
import { Competition } from 'src/app/models/Competition';
import { CompetionService } from 'src/app/Services/competion.service';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.css']
})
export class CompetitionsComponent implements OnInit {
  competitions: Competition[] = [];
  filteredCompetitions: Competition[] = []; // To store filtered results
  isLightMode = true;
  isLoading = true;
  searchTerm: string = ''; // To store the search input

  constructor(private competionService: CompetionService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.isLoading = true;
    this.competionService.getCompetitions().subscribe(data => {
      this.competitions = data;
      this.filteredCompetitions = data; // Initially, show all competitions
      this.isLoading = false;
    });
  }

  // Search function to filter competitions by title
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      // If search term is empty, show all competitions
      this.filteredCompetitions = this.competitions;
    } else {
      // Filter competitions by title (case-insensitive)
      this.filteredCompetitions = this.competitions.filter(competition =>
        competition.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
}