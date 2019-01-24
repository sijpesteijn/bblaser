import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { PaperService } from '../../paper/paper.service';

@Component({
  selector: 'bb-animation-canvas-settings',
  template: `
    <mat-card>
      <button mat-button (click)="toggleGrid()">
        <mat-icon *ngIf="grid">grid_on</mat-icon>
        <mat-icon *ngIf="!grid">grid_off</mat-icon>
      </button>
      <mat-checkbox (change)="toggleSnapToGrid($event)" [checked]="false">Snap to grid</mat-checkbox>
    </mat-card>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimationCanvasSettingsComponent {
  grid = true;
  constructor(private paperService: PaperService) { }

  toggleGrid() {
    this.grid = !this.grid;
    this.paperService.showGrid(this.grid);
  }

  toggleSnapToGrid(event: MatCheckboxChange) {
    this.paperService.snapToGrid(event.checked);
  }

}
