import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ReclamationService } from 'src/app/Services/reclamation.service';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent {
  postId: number;
  reclamationForm!: FormGroup;

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
    this.reclamationForm = this.fb.group({
      reason: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      name: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.reclamationForm.valid) {
      const { reason, email, name } = this.reclamationForm.value;
      this.reclamationService.createReclamation(this.postId, reason, email, name).subscribe(
        res => {
          this.matSnackBar.open("Reclamation submitted successfully!", "Ok");
          this.router.navigate([`/view-post/${this.postId}`]);
        },
        error => {
          this.matSnackBar.open("Something went wrong!!");
        }
      );
    }
  }cancel() {
    this.router.navigate(['/list-reclamations', this.postId]);
  }
}
