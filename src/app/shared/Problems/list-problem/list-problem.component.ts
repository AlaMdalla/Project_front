import { Component, OnInit } from '@angular/core';
import { Problem } from 'src/app/models/Problem';
import { PoblemService } from 'src/app/Services/poblem.service';

@Component({
  selector: 'app-list-problem',
  templateUrl: './list-problem.component.html',
  styleUrls: ['./list-problem.component.css']
})
export class ListProblemComponent implements OnInit {
  problems: Problem[] = [];
  filteredProblems: Problem[] = []; // To store filtered results
  selectedDifficulty: string = ''; // To store the selected difficulty filter

  constructor(private problemsS: PoblemService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.problemsS.getProblems().subscribe(data => {
      this.problems = data;
      this.filteredProblems = data; // Initially, show all problems
    });
  }

  // Filter function to filter problems by difficulty
  onDifficultyFilter(): void {
    if (!this.selectedDifficulty) {
      // If no difficulty is selected, show all problems
      this.filteredProblems = this.problems;
    } else {
      // Filter problems by selected difficulty (case-insensitive)
      this.filteredProblems = this.problems.filter(problem =>
        problem.difficulty.toLowerCase() === this.selectedDifficulty.toLowerCase()
      );
    }
  }

  deleteProblem(id: number): void {
    // Placeholder for delete logic, can be implemented later
    console.log(`Delete problem with id: ${id}`);
  }
}