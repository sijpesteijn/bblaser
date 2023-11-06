import { Component, Inject, OnInit } from '@angular/core';
import { BBAnimation } from '../animations/animation.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'bb-settings-dialog',
  template: `
    <h1 mat-dialog-title>Settings</h1>
    <mat-dialog-content class="mat-typography">
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancelClick()">Cancel</button>
      <button mat-flat-button color="primary" [mat-dialog-close]="true" cdkFocusInitial>Save</button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class SettingsDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SettingsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public settings: BBAnimation) {}

  ngOnInit() {
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}
