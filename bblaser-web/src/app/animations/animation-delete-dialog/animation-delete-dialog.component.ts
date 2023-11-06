import { Component, Inject, OnInit } from '@angular/core';
import { BBAnimation } from '../animation.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'bb-animation-delete-dialog',
  template: `
    <mat-dialog-content class="mat-typography">
      <p>Do you want to delete {{animation.name}}?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-flat-button color="primary" [mat-dialog-close]="true" cdkFocusInitial>Ok</button>
    </mat-dialog-actions>
  `,
  styles: [`
  `]
})
export class AnimationDeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<AnimationDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public animation: BBAnimation) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
