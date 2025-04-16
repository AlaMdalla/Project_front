import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Problem } from 'src/app/models/Problem';
import { tags } from 'src/app/models/tags';
import { PoblemService } from 'src/app/Services/poblem.service';

@Component({
  selector: 'app-add-problem',
  templateUrl: './add-problem.component.html',
  styleUrls: ['./add-problem.component.css']
})
export class AddProblemComponent implements OnInit {
  problemForm!: FormGroup;
  problemId: number | null = null; // Store the problem ID if updating
  tags = Object.values(tags); 
  selectedTags: string[] = [];
  isAddProblem!: boolean;

  constructor(
    private fb: FormBuilder,
    private problemService: PoblemService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.problemForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      linkTotestcases: ['', [Validators.required, Validators.minLength(3)]],

      difficulty: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      mainClass: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.problemId = +id; 
        this.loadProblem(this.problemId);
      }
    });
  }

  loadProblem(id: number) {
    this.problemService.getProblem(id).subscribe(problem => {
      this.problemForm.patchValue(problem);
      this.selectedTags = problem.tags || [];
    });
  }

  onTagChange(event: Event) {
    const selectedOptions = (event.target as HTMLSelectElement).selectedOptions;
    this.selectedTags = Array.from(selectedOptions).map(option => option.value);
  }

  removeTag(tag: string) {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
  }

  onSubmit() {
    if (this.problemForm.valid && this.selectedTags.length) {
      const problemData = {
        ...this.problemForm.value,
        tags: this.selectedTags
      };

      if (this.problemId) {
        this.problemService.updateProblem(this.problemId, problemData).subscribe(
          res => {
            console.log('Updated successfully', res);
            this.router.navigate(['/addProblem']); 
          },
          error => console.error('Error updating:', error)
        );
      } else {
        // Create new problem
        this.problemService.addProblem(problemData).subscribe(
          res => {
            console.log('Added successfully', res);
            this.router.navigate(['/problems']); 
          },
          error => console.error('Error adding:', error)
        );
      }
    }
  }
  
  closeForm() {
    this.isAddProblem = false;
    this.problemForm.reset();
    this.selectedTags = []; // Reset tags on close
  }
}