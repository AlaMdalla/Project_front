import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ReclamationService } from 'src/app/Services/reclamation.service';

@Component({
  selector: 'app-listereclamation',
  templateUrl: './listereclamation.component.html',
  styleUrls: ['./listereclamation.component.css']
})
export class ListereclamationComponent {
  reclamations: any[] = []; // Use a plain array
  displayedColumns: string[] = [ 'reason', 'email', 'name', 'createdAt', 'actions'];

  constructor(
    private reclamationService: ReclamationService,
    private matSnackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllReclamations();
  }

  getAllReclamations() {
    this.reclamationService.getAllReclamations().subscribe(
      res => {
        this.reclamations = res; 
      },
      error => {
        this.matSnackBar.open("Something went wrong!!", "Close", { duration: 3000 });
        console.error('Error fetching reclamations:', error);
      }
    );
  }

  updateReclamation(id: number) {
    this.router.navigate([`/reclamation-edit/${id}`]);
    this.matSnackBar.open("Edit reclamation (implement edit form)", "Close", { duration: 3000 });
  }

  deleteReclamation(id: number) {
    if (confirm("Are you sure you want to delete this reclamation?")) {
      this.reclamationService.deleteReclamation(id).subscribe(
        res => {
          this.matSnackBar.open("Reclamation deleted successfully!", "Close", { duration: 3000 });
          this.getAllReclamations(); // Refresh the list
        },
        error => {
          this.matSnackBar.open("Something went wrong!!", "Close", { duration: 3000 });
          console.error('Error deleting reclamation:', error);
        }
      );
    }
  }

}
