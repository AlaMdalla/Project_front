import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Competition } from 'src/app/models/Competition';
import { Problem } from 'src/app/models/Problem';
import { CompetionService } from 'src/app/Services/competion.service';

@Component({
  selector: 'app-add-competition',
  templateUrl: './add-competition.component.html',
  styleUrls: ['./add-competition.component.css']
})
export class AddCompetitionComponent {
  competitionForm: FormGroup;

  competitionId:number | null = null;;
  availableProblems: Problem[] = [];
  competitions: Competition[] =[];
  constructor(private fb: FormBuilder,private competionService:CompetionService,
        private route: ActivatedRoute,
        private router: Router
  ) {
    this.competitionForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      prices: [[]],
      problems: [[]]
    });
  }
  ngOnInit() {
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.competitionId = +id; 
        this.loadCompetion(this.competitionId);
      }
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
      if (this.competitionId) {
        this.competionService.updateProblem(this.competitionId, newCompetition).subscribe(
          res => {
            console.log('Updated successfully', res);
            this.router.navigate(['/addCompetition']); 
          },
          error => console.error('Error updating:', error)
        );
      }
      else{
        this.competionService.addCompetition(newCompetition).subscribe(
          res=>{
  
            console.log(res)
            
          },
          error=>{
  console.error(error)
  
          },
          
          
        )
        window.location.reload(); 
  
        console.log('Competition Submitted:', newCompetition);
      }
      }
     
  }













  
    refrech():void{
    this.competionService.getCompetitions().subscribe(data =>
      
      {
        this.competitions=data;}
      );
  }


  closeForm() {
    this.competitionForm.reset();
  }
  loadCompetion(id: number) {
    this.competionService.getCompetition(id).subscribe(competion => {
      this.competitionForm.patchValue(competion);
    });
  }
}
