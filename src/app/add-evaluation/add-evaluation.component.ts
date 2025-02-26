import {Component, OnInit} from '@angular/core';
import {Evaluation} from "../models/Evaluation";
import {EvaluationService} from "../Services/evaluation.service";

@Component({
  selector: 'app-add-evaluation',
  templateUrl: './add-evaluation.component.html',
  styleUrls: ['./add-evaluation.component.css']

})
export class AddEvaluationComponent implements OnInit {
  evaluations: Evaluation[] = [];
  newEvaluation: Evaluation = {
    idEvaluation: 0,
    trainingId: 0,
    description: '',
    type: '',
    evaluationDuration: '',
    score: 0,
    createdAt: new Date(),
    certificat: false,
    questions: []
  };

  constructor(private evaluationService: EvaluationService) {}

  ngOnInit(): void {
    this.loadEvaluations();
  }

  loadEvaluations(): void {
    this.evaluationService.getAllEvaluations().subscribe(data => {
      this.evaluations = data;
    });
  }

  addEvaluation(): void {
    this.evaluationService.addEvaluation(this.newEvaluation).subscribe(() => {
      this.loadEvaluations();
      this.resetForm();
    });
  }

  deleteEvaluation(id: number): void {
    this.evaluationService.deleteEvaluation(id).subscribe(() => {
      this.evaluations = this.evaluations.filter(e => e.idEvaluation !== id);
    });
  }

  resetForm(): void {
    this.newEvaluation = {
      idEvaluation: 0,
      trainingId: 0,
      description: '',
      type: '',
      evaluationDuration: '',
      score: 0,
      createdAt: new Date(),
      certificat: false,
      questions: []
    };
  }
}
