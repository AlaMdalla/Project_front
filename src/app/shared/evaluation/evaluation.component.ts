import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { EvaluationService } from "../../Services/evaluation.service";
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  standalone: true,
  styleUrls: ['./evaluation.component.css'],
  imports: [CommonModule, FormsModule]
})
export class EvaluationComponent implements OnInit {
  evaluation: any = { description: '', evaluationDuration: '', type: '', questions: [] };
  questions: any[] = [];
  totalScore: number = 0;
  isPassed: boolean = false;
  showResult: boolean = false;
  remainingTime: number = 60;
  maxTime: number = 60;
  interval: any;
  isPageVisible = true;
  warningCount = 0;
  maxWarnings = 3;
  warningMessage: string = '';
  answers: any = {};
  answeredQuestions = 0;

  constructor(private evaluationService: EvaluationService, private route: ActivatedRoute,
              private router: Router,      ) {}

  ngOnInit(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.isPageVisible = false;
        clearInterval(this.interval);
        this.warningCount++;
        this.warningMessage = `⚠️ Tentative de triche détectée ! Vous avez quitté la page (${this.warningCount}/${this.maxWarnings}).`;
        this.autoSave();

        if (this.warningCount >= this.maxWarnings) {
          this.router.navigate(['/quiz-failed']);
        }
      } else {
        this.isPageVisible = true;
        this.warningMessage = ''; // Effacer le message d'avertissement lorsqu'on revient sur la page
        if (this.remainingTime > 0) {
          this.startTimer();
        }
      }
    });

    const evaluationId = this.route.snapshot.paramMap.get('id');
    if (evaluationId) {
      this.evaluationService.getEvaluationById(+evaluationId).subscribe(
        (data: any) => {
          this.evaluation = data || { description: '', evaluationDuration: '', type: '', questions: [] };
          this.questions = this.processQuestions(this.evaluation.questions);
          this.remainingTime = this.evaluation.evaluationDuration *60;
          this.maxTime = this.evaluation.evaluationDuration;
          this.startTimer();
        },
        error => {
          console.error('Erreur lors du chargement de l’évaluation', error);
        }
      );
    }
  }

  startTimer(): void {
    this.interval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(this.interval);
        this.calculateScore();
      }
    }, 1000);
  }

  processQuestions(questions: any[]): any[] {
    return questions.map(question => {
      return { ...question, options: [...question.options, question.bonneReponse] };
    });
  }

  onOptionSelect(question: any): void {
    this.answers[question.questionText] = question.selectedOption;
    this.updateProgress();
  }

  updateProgress(): void {
    this.answeredQuestions = this.questions.filter(q => q.selectedOption).length;
  }

  getTimeProgress(): number {
    return (this.remainingTime / this.maxTime) * 100;
  }

  getQuestionProgress(): number {
    return (this.answeredQuestions / this.questions.length) * 100;
  }

  calculateScore(): void {
    clearInterval(this.interval);
    let score = 0;
    const totalQuestions = this.questions.length;

    for (let question of this.questions) {
      if (question.selectedOption === question.bonneReponse) {
        score += 1;
      }
    }

    this.totalScore = (score / totalQuestions) * 100;
    this.isPassed = this.totalScore >= this.evaluation?.score;
    this.showResult = true;
  }

  autoSave(): void {
    localStorage.setItem('quizAnswers', JSON.stringify(this.answers));
  }
}
