import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Job } from 'src/app/models/Job';

@Component({
  selector: 'app-job-popup',
  templateUrl: './job-popup.component.html',
  styleUrls: ['./job-popup.component.css']
})
export class JobPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<JobPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public job: Job
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}