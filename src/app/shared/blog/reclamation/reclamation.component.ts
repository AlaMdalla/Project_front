import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ReclamationService } from 'src/app/Services/reclamation.service';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css'],
  standalone: false,
})
export class ReclamationComponent implements OnInit {
  postId: number;
  reclamationForm!: FormGroup;
  userId?: number;

  constructor(
    private fb: FormBuilder,
    private reclamationService: ReclamationService,
    private matSnackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    this.postId = +this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    // Get userId from query parameters
    this.activatedRoute.queryParams.subscribe(params => {
      const userIdFromQuery = params['userId'];
      if (userIdFromQuery) {
        this.userId = parseInt(userIdFromQuery, 10);
        if (isNaN(this.userId)) {
          console.error('Invalid userId from query params:', userIdFromQuery);
          this.userId = undefined;
        }
      }
    });

    // If userId is not found, redirect to login
    if (!this.userId) {
      this.matSnackBar.open("Vous devez être connecté pour soumettre une réclamation", "Close", { duration: 5000 });
      this.router.navigate(['/login']);
    }

    // Initialize the form
    this.reclamationForm = this.fb.group({
      reason: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.reclamationForm.valid && this.userId) {
      const { reason } = this.reclamationForm.value;
      this.reclamationService.createReclamation(this.postId, this.userId, reason).subscribe(
        res => {
          this.matSnackBar.open("Reclamation submitted successfully!", "Ok", { duration: 3000 });
          this.router.navigate([`/view-post/${this.postId}`]);
        },
        error => {
          const errorMessage = error.error || "Something went wrong!!";
          this.matSnackBar.open(errorMessage, "Close", { duration: 3000 });
        }
      );
    } else {
      if (!this.userId) {
        this.matSnackBar.open("Vous devez être connecté pour soumettre une réclamation", "Close", { duration: 5000 });
        this.router.navigate(['/login']);
      } else {
        this.matSnackBar.open("Please fill out the form correctly", "Close", { duration: 3000 });
      }
    }
  }

  cancel() {
    this.router.navigate(['/list-reclamations', this.postId]);
  }
}