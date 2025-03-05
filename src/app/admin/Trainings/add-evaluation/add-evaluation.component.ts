import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Evaluation } from "src/app/models/Evaluation";
import {Question, type} from "src/app/models/Question";
import {AppModule} from "../../../app.module";

@Component({
  selector: 'app-add-evaluation',
  templateUrl: './add-evaluation.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./add-evaluation.component.css']
})
export class AddEvaluationComponent implements OnInit {
  evaluationsForm: FormGroup;
  questions: Question[] = [];  // Liste des questions disponibles
  selectedQuestions: Question[] = []; // Questions sélectionnées
  selectedEvaluation: Evaluation | null = null;

  constructor(private fb: FormBuilder) {
    this.evaluationsForm = this.fb.group({
      description: ['', Validators.required],
      category: ['', Validators.required],
      evaluationDuration: ['', Validators.required],
      score: ['', [Validators.required, Validators.min(0)]],
      certificat: [false],
      selectedQuestions: [[]]  // Stocke les IDs des questions sélectionnées
    });
  }

  ngOnInit(): void {

  }

  onSubmit() {

  }

  closeForm() {

  }
}
