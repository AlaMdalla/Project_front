import {Component, OnInit} from '@angular/core';
import {Evaluation} from "../../models/Evaluation";
import {EvaluationService} from "../../Services/evaluation.service";

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit{

  evaluations: Evaluation[] = [];

  constructor(private evaluationService: EvaluationService) {}

  ngOnInit(): void {
    this.getEvaluations();
  }

  getEvaluations(): void {
    this.evaluationService.getAllEvaluations().subscribe((data: Evaluation[]) => {
      this.evaluations = data;
    });
  }

  deleteEvaluation(id: number): void {
    this.evaluationService.deleteEvaluation(id).subscribe(() => {
      this.evaluations = this.evaluations.filter(e => e.idEvaluation !== id);
    });
  }

  editEvaluation(evaluation: Evaluation): void {
    console.log('Modifier', evaluation);
  }
}

