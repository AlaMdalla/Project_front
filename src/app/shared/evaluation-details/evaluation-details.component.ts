import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvaluationService } from 'src/app/Services/evaluation.service';

@Component({
  selector: 'app-evaluation-details',
  templateUrl: './evaluation-details.component.html',
  styleUrls: ['./evaluation-details.component.css']
})
export class EvaluationDetailsComponent {
 evaluation: any = { // Initialize to prevent undefined errors
    description: '',
    evaluationDuration: '',
    type: '',
    questions: []
  };

  questions: any[] = [];
  training: any[] = [];
  options: any[] = [];
  isPassed: any;
  showResult: any;
  totalScore: any;


  constructor(private evaluationService: EvaluationService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const evaluationId = this.route.snapshot.paramMap.get('id');
    if (evaluationId) {
      this.evaluationService.getEvaluationById(+evaluationId).subscribe(
        (data: any) => {
          this.evaluation = data || { description: '', evaluationDuration: '', type: '', questions: [] };
          this.questions = this.processQuestions(this.evaluation.questions);        },
        error => {
          console.error('Erreur lors du chargement de l’évaluation', error);
        }
      );
    }
  }

  getEvaluationDetails(id: number): void {
    this.evaluationService.getEvaluationById(id).subscribe(
      (data: any) => {
       // this.questions = this.processQuestions(data.questions);
        this.evaluation = data || { description: '', evaluationDuration: '', type: '', questions: [] };
        this.training = data.training || [];
        //this.options = this.questions.op || [];

      },
      error => {
        console.error('Erreur lors du chargement de l’évaluation', error);
      }
    );
  }

  onOptionSelect(question: any) {

    console.log(`Selected answer for question "${question.question_text}": ${question.selectedOption}`);
  }

  /**
   * Traite la liste des questions en insérant la bonne réponse à une position aléatoire.
   */
  processQuestions(questions: any[]): any[] {
    let processedQuestions = [];

    for (let question of questions) {
      let options = [...question.options]; // Clone les options existantes

      // Vérifie que la bonne réponse n'est pas déjà présente dans la liste
      if (!options.includes(question.bonneReponse)) {
        const randomIndex = Math.floor(Math.random() * (options.length + 1)); // Génère un index aléatoire
        options.splice(randomIndex, 0, question.bonneReponse); // Insère la bonne réponse
      }

      processedQuestions.push({
        ...question,
        options: options
      });
    }

    return processedQuestions;
  }
  calculateScore(): void {
    let totalScore = 0;
    const totalQuestions = this.questions.length;

    if (totalQuestions === 0) {
      console.warn("Aucune question disponible pour calculer le score.");
      return;
    }

    const pointsPerQuestion = 100 / totalQuestions;

    for (let question of this.questions) {
      if (question.selectedOption === question.bonneReponse) {
        totalScore += pointsPerQuestion;
      }
    }
    this.totalScore = totalScore;
    this.isPassed = totalScore >= (this.evaluation?.score);
    this.showResult = true;
  }

}
