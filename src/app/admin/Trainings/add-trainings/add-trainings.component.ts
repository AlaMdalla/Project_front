import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainingService } from 'src/app/Services/training.service';
import { Training, Status, Level } from 'src/app/models/Training';

@Component({
  selector: 'app-add-trainings',
  templateUrl: './add-trainings.component.html',
  styleUrls: ['./add-trainings.component.css']
})
export class AddTrainingsComponent implements OnInit {
  trainingForm!: FormGroup;
  Trainings: Training[] = [];
  selectedTraining: Training | null = null;  // Stocke la formation en cours de modification
  statusOptions = Object.values(Status);
  levelOptions = Object.values(Level);

  constructor(private fb: FormBuilder, private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadTrainings();  // Charger les formations au démarrage du composant
  }

  // Initialiser le formulaire avec les champs obligatoires
  initializeForm(): void {
    this.trainingForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      trainingdate: ['', Validators.required],
      duration: ['', Validators.required],
      status: ['', Validators.required],
      level: ['', Validators.required]
    });
  }

  // Charger les formations depuis le backend
  loadTrainings(): void {
    this.trainingService.gettrainings().subscribe(data => {
      this.Trainings = data;
    }, error => {
      console.error('Erreur lors du chargement des formations:', error);
    });
  }

  // Soumettre le formulaire pour ajouter ou modifier une formation
  onSubmit(): void {
    if (this.trainingForm.valid) {
      const trainingData: Training = this.trainingForm.value;

      // ✅ Convertir trainingdate au format YYYY-MM-DD
      trainingData.trainingdate = new Date(trainingData.trainingdate).toISOString().split('T')[0];

      console.log('Data being sent to backend:', JSON.stringify(trainingData, null, 2));

      if (this.selectedTraining) {
        trainingData.idTraining = this.selectedTraining.idTraining;
        this.modifyTraining(trainingData);
      } else {
        this.addTraining(trainingData);
      }
    }
  }

  // Ajouter une nouvelle formation
  addTraining(trainingData: Training): void {
    this.trainingService.addTraining(trainingData).subscribe(response => {
      console.log('Formation ajoutée avec succès:', response);
      this.loadTrainings();  // Rafraîchir la liste des formations
      this.trainingForm.reset();  // Réinitialiser le formulaire
    }, error => {
      console.error('Erreur lors de l\'ajout de la formation:', error);
    });
  }

  // Modifier une formation existante
  modifyTraining(trainingData: Training): void {
    this.trainingService.modifyTraining(trainingData).subscribe(response => {
      console.log('Formation mise à jour avec succès:', response);
      this.loadTrainings();  // Rafraîchir la liste des formations
      this.trainingForm.reset();  // Réinitialiser le formulaire
      this.selectedTraining = null;  // Réinitialiser la sélection
    }, error => {
      console.error('Erreur lors de la mise à jour de la formation:', error);
    });
  }

  // Supprimer une formation
  deleteTraining(trainingId: number): void {
    this.trainingService.deleteTraining(trainingId).subscribe(() => {
      console.log('Formation supprimée avec succès');
      this.loadTrainings();  // Rafraîchir la liste après suppression
    }, error => {
      console.error('Erreur lors de la suppression de la formation:', error);
    });
  }

  // Sélectionner une formation pour la modification
  editTraining(training: Training): void {
    this.selectedTraining = training;
    this.trainingForm.patchValue({
      title: training.title,
      content: training.content,
      trainingdate: training.trainingdate,
      duration: training.duration,
      status: training.status,
      level: training.level
    });
  }

  // Fermer le formulaire et réinitialiser
  closeForm(): void {
    this.trainingForm.reset();
    this.selectedTraining = null;
  }
}
