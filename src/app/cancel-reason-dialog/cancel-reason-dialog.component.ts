import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-reason-dialog',
  templateUrl: './cancel-reason-dialog.component.html',
  styleUrls: ['./cancel-reason-dialog.component.css']
})
export class CancelReasonDialogComponent {
  reasons: string[] = [
    'Not satisfied with the service',
    'Found a better offer',
    'Too expensive',
    'No longer needed',
    'Technical issues',
    'Other'
  ];
  selectedReason: string = '';

  constructor(public dialogRef: MatDialogRef<CancelReasonDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(this.selectedReason);
  }
}
