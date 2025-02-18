import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-problem',
  templateUrl: './add-problem.component.html',
  styleUrls: ['./add-problem.component.css']
})
export class AddProblemComponent {
  problems = [
    { title: 'Problem 1', difficulty: 'Easy', tags: ['Arrays', 'Sorting'], description: 'Description here', mainClass: 'MainClass1' },
    { title: 'Problem 2', difficulty: 'Medium', tags: ['Strings'], description: 'Description here', mainClass: 'MainClass2' }
  ];
  isAddProblem = false;
  problemForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.problemForm = this.fb.group({
      title: ['', Validators.required],
      difficulty: ['', Validators.required],
      tags: [''],
      description: ['', Validators.required],
      mainClass: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.problemForm.valid) {
      this.problems.push(this.problemForm.value);
      this.isAddProblem = false;
      this.problemForm.reset();
    }
  }

  addTag(tag: string) {
   
  }

  closeForm() {
    this.isAddProblem = false;
  }

  toggleAddProblem() {
    this.isAddProblem = !this.isAddProblem;
  }

}
