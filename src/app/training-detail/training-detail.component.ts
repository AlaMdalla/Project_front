import {Component, Input} from '@angular/core';
import {Training} from "../models/Training";
import {TrainingService} from "../Services/training.service";
import {ActivatedRoute} from "@angular/router";
//import { Training } from 'src/app/models/training';
@Component({
  selector: 'app-training-detail',
  templateUrl: './training-detail.component.html',
  styleUrls: ['./training-detail.component.css']
})
export class TrainingDetailComponent {
  constructor(
    private route: ActivatedRoute,  // 👈 Injection de ActivatedRoute
    private trainingService: TrainingService
  ) {}
  @Input() training!: Training; // Formation en entrée
  showEvaluationForm: boolean = false;

  toggleEvaluation() {
    this.showEvaluationForm = !this.showEvaluationForm;
  }

  submitEvaluation(evaluation: number) {
    alert(`Merci pour votre évaluation : ${evaluation}/5 ⭐`);
    this.showEvaluationForm = false;
  }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.trainingService.getTrainingById(+id).subscribe((data) => {
        this.training = data;
      });
    }
  }
}

