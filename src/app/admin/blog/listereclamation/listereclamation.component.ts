import { Component, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ReclamationService } from 'src/app/Services/reclamation.service';

@Component({
  selector: 'app-listereclamation',
  templateUrl: './listereclamation.component.html',
  styleUrls: ['./listereclamation.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ListereclamationComponent {
  reclamations: any[] = [];
  displayedColumns: string[] = ['reason', 'createdAt', 'actions'];

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

  deleteReclamation(id: number) {
    if (confirm("Are you sure you want to delete this reclamation?")) {
      this.reclamationService.deleteReclamation(id).subscribe(
        res => {
          this.matSnackBar.open("Reclamation deleted successfully!", "Close", { duration: 3000 });
          this.getAllReclamations();
        },
        error => {
          this.matSnackBar.open("Something went wrong!!", "Close", { duration: 3000 });
          console.error('Error deleting reclamation:', error);
        }
      );
    }
  }

  exportToExcel() {
    this.reclamationService.exportReclamationsToExcel().subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'reclamations.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        this.matSnackBar.open("Excel file exported successfully!", "Close", { duration: 3000 });
      },
      error => {
        this.matSnackBar.open("Error exporting reclamations!", "Close", { duration: 3000 });
        console.error('Error exporting to Excel:', error);
      }
    );
  }
}