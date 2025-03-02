import { Component, OnInit } from '@angular/core';
import { Evaluation } from 'src/app/models/Evaluation';
import { EvaluationService } from 'src/app/Services/evaluation.service';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {
  evaluations: Evaluation[] = [];

  constructor(private evaluationService: EvaluationService) {}

  ngOnInit(): void {
    this.loadEvaluations();
  }

  // Charger la liste des évaluations
  loadEvaluations(): void {
    this.evaluationService.getAllEvaluations().subscribe(data => {
      this.evaluations = data;
    });
  }

  editEvaluation(evaluation: Evaluation): void {
    console.log('Modification de l’évaluation :', evaluation);
    // Implémenter la logique de modification
  }

  deleteEvaluation(idEvaluation: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette évaluation ?')) {
      this.evaluationService.deleteEvaluation(idEvaluation).subscribe(() => {
        this.evaluations = this.evaluations.filter(e => e.idEvaluation !== idEvaluation);
      });
    }
  }
}
