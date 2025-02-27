import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Problem } from 'src/app/models/Problem';
import { tags } from 'src/app/models/tags';
import { PoblemService } from 'src/app/Services/poblem.service';

@Component({
  selector: 'app-add-problem',
  templateUrl: './add-problem.component.html',
  styleUrls: ['./add-problem.component.css']
})
export class AddProblemComponent {
  isAddProblem = false;
  problemForm!: FormGroup;
  problem!: Problem;

  tags = Object.values(tags); // Convert Enum to Array
  selectedTags: string[] = []; // Changed to string[] to match HTML usage

  constructor(private fb: FormBuilder, private problemService: PoblemService) {}

  ngOnInit() {
    this.problemForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      difficulty: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      mainClass: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onTagChange(event: Event) {
    const selectedOptions = (event.target as HTMLSelectElement).selectedOptions;
    this.selectedTags = Array.from(selectedOptions).map(option => option.value); // Simplified to string values
  }

  removeTag(tag: string) {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
  }

  onSubmit() {
    if (this.problemForm.valid && this.selectedTags.length) { // Added check for tags
      this.problem = {
        ...this.problemForm.value,
        tags: this.selectedTags
      };

      this.problemService.addProblem(this.problem).subscribe(
        res => {
          console.log(res, 'added successfully');
          window.location.reload();
        },
        error => {
          console.log(error);
          window.location.reload();
        }
      );
    }
  }

  closeForm() {
    this.isAddProblem = false;
    this.problemForm.reset();
    this.selectedTags = []; // Reset tags on close
  }

  toggleAddProblem() {
    this.isAddProblem = !this.isAddProblem;
  }

  // Removed submitTags as it's no longer needed with the integrated form
}