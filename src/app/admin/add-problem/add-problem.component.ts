import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoblemService } from 'src/app/Services/poblem.service';

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
  tags=null
  constructor(private fb: FormBuilder,private problemService:PoblemService) {}

  ngOnInit() {
    this.problemForm = this.fb.group({
      title: ['', Validators.required],
      difficulty: ['', Validators.required],
      description: ['', Validators.required],
      mainClass: ['', Validators.required]
    });
  }



  onSubmit() {
    if (this.problemForm.valid) {
      this.problemService.addProblem(this.problemForm.value).subscribe(
        res =>{
          console.log(res ,'added succssefuly');
        },
        error =>{
console.log(error);
        }
      )
    }
  }


 

  closeForm() {
    this.isAddProblem = false;
  }

  toggleAddProblem() {
    this.isAddProblem = !this.isAddProblem;
  }

}
