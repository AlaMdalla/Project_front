import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Competition } from 'src/app/models/Competition';
import { Problem } from 'src/app/models/Problem';

@Component({
  selector: 'app-add-competition',
  templateUrl: './add-competition.component.html',
  styleUrls: ['./add-competition.component.css']
})
export class AddCompetitionComponent {
  competitionForm: FormGroup;
  availableProblems: Problem[] = [];

  constructor(private fb: FormBuilder) {
    this.competitionForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      prices: [[]],
      problems: [[]]
    });
  }

  addPrice(price: string) {
    if (price.trim()) {
      this.competitionForm.get('prices')?.value.push(price);
      this.competitionForm.get('prices')?.updateValueAndValidity();
    }
  }

  removePrice(price: string) {
    this.competitionForm.get('prices')?.setValue(this.competitionForm.get('prices')?.value.filter((p: string) => p !== price));
  }

  addProblem(problemTitle: string) {
    const selectedProblem = this.availableProblems.find(p => p.title === problemTitle);
    if (selectedProblem) {
      this.competitionForm.get('problems')?.value.push(selectedProblem);
      this.competitionForm.get('problems')?.updateValueAndValidity();
    }
  }

  removeProblem(problem: Problem) {
    this.competitionForm.get('problems')?.setValue(this.competitionForm.get('problems')?.value.filter((p: Problem) => p.id !== problem.id));
  }

  onSubmit() {
    if (this.competitionForm.valid) {
      const newCompetition: Competition = this.competitionForm.value;
      console.log('Competition Submitted:', newCompetition);
    }
  }

  closeForm() {
    this.competitionForm.reset();
  }
}
