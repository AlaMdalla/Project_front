import {Component, HostListener, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationService } from '../../Services/evaluation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import html2canvas from "html2canvas";
import * as jsPDF from "jspdf";

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  standalone: true,
  styleUrls: ['./evaluation.component.css'],
  imports: [CommonModule, FormsModule]
})
export class EvaluationComponent implements OnInit {
  evaluations: any[] = [];
  selectedEvaluation: any = null;
  questions: any[] = [];
  userLevel: string = "Beginner";
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
  selectedLevel: string = '';
  filteredEvaluations: any[] = [];

  selectedNiveau: string = '';
  constructor(
    private evaluationService: EvaluationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    const trainingId = this.route.snapshot.paramMap.get('id');
    if (trainingId) {
      this.evaluationService.getEvaluationsByTrainingId(+trainingId).subscribe(
        (data: any[]) => {
          this.evaluations = data;
          console.log('🔎 Evaluations récupérées:', this.evaluations);
          this.filteredEvaluations = data; // initial display
        },
        error => {
          console.error('Erreur lors du chargement des évaluations', error);
        }
      );
    }


    if (trainingId) {
      this.evaluationService.getEvaluationsByTrainingId(+trainingId).subscribe(
        (data: any[]) => {
          this.evaluations = data;
          console.log('Évaluations récupérées :', this.evaluations);
        },
        error => {
          console.error('Erreur lors du chargement des évaluations', error);
        }
      );
    }

    // ✅ Détection de triche : visibility change
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
        this.warningMessage = '';
        if (this.remainingTime > 0) {
          this.startTimer();
        }
      }
    });
  }
// ✅ BLOQUER copier / coller / clic droit / raccourcis
  @HostListener('document:copy', ['$event'])
  handleCopy(event: ClipboardEvent) {
    event.preventDefault();
    alert("🚫 Copier est désactivé !");
  }

  @HostListener('document:paste', ['$event'])
  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    alert("🚫 Coller est désactivé !");
  }

  @HostListener('document:contextmenu', ['$event'])
  handleRightClick(event: MouseEvent) {
    event.preventDefault();
    alert("🚫 Clic droit interdit !");
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    const forbiddenCombos = ['c', 'v', 'u'];
    if ((event.ctrlKey && forbiddenCombos.includes(event.key.toLowerCase())) || event.key === 'F12') {
      event.preventDefault();
      alert("⛔ Cette action est bloquée !");
    }
  }

  getLevelIcon(niveau: string): string {
    switch (niveau) {
      case 'Beginner': return '🌶️';
      case 'Intermediate': return '🌶️🌶️';
      case 'Advanced': return '🌶️🌶️🌶️';
      default: return '';
    }

  }

  getLevelClass(niveau: string): string {
    switch (niveau) {
      case 'Beginner': return 'easy';
      case 'Intermediate': return 'medium';
      case 'Advanced': return 'hard';
      default: return '';
    }

  }
  // 🔍 Fonction de filtrage par niveau
  filterEvaluationsByNiveau(): void {
    if (this.selectedNiveau === '') {
      this.filteredEvaluations = this.evaluations; // Tous les niveaux
    } else {
      this.filteredEvaluations = this.evaluations.filter(e => e.niveau === this.selectedNiveau);


    }  }

  selectEvaluation(evaluation: any): void {
    if (this.isEvaluationAccessible(evaluation.niveau)) {
      this.selectedEvaluation = evaluation;
      this.questions = this.processQuestions(evaluation.questions || []);
      this.remainingTime = evaluation.evaluationDuration ;//60
      this.maxTime = evaluation.evaluationDuration;
      this.startTimer();
    } else {
      alert("⚠️ Vous n'avez pas le niveau requis pour accéder à cette évaluation.");
    }
  }

  isEvaluationAccessible(niveau: string): boolean {
    const niveaux = ['Beginner', 'Intermediate', 'Advanced'];
    const userLevelIndex = niveaux.indexOf(this.userLevel);
    const evaluationLevelIndex = niveaux.indexOf(niveau);
    return userLevelIndex >= evaluationLevelIndex;
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
  generatePDF(): void {
    const element = document.getElementById('resultToExport'); // L'élément HTML à exporter
    if (!element) return;

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF.default('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const dateStr = new Date().toLocaleDateString().replace(/\//g, '-');
      pdf.save(`resultat_evaluation_${dateStr}.pdf`);
    });
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
    this.isPassed = this.totalScore >= this.selectedEvaluation?.score;
    this.showResult = true;
  }

  autoSave(): void {
    localStorage.setItem('quizAnswers', JSON.stringify(this.answers));
  }
}
