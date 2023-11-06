import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TimelineObject, TimelineRow } from '../store/index';
import { TimeScale } from '../timeline.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'bb-timeline-row-delete-dialog',
  template: `
    <!--<mat-dialog-content class="mat-typography">
      <p>Do you want to delete {{timelineRow.name}}?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-flat-button color="primary" [mat-dialog-close]="true" cdkFocusInitial>Ok</button>
    </mat-dialog-actions> -->
  `,
  styles: [`
  `]
})
export class TimelineRowDeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<TimelineRowDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public timelineRow: TimelineRow) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}

@Component({
  selector: 'bb-timeline-row',
  template: `
    <div class="timeline-row">
    <!--  <div class="timeline-row-container"
           [ngClass]="{'selected': timelineRow.selected, 'highlight': timelineRow.highlight}">
        <div class="timeline-row-content"
             [ngStyle]="{'height.px': (timelineRow | timelineRowMaxEffects)}">
          <bb-timeline-row-object *ngFor="let timelineObject of timelineRow.timelineObjects"
                                  [timelineObject]="timelineObject"
                                  [timeScale]="timeScale"
                                  [expanded]="timelineRow.expanded"
                                  (timelineObjectChanged)="handleTimelineObjectChanged($event)">
          </bb-timeline-row-object>
        </div>
      </div> -->
    </div>
  `,
  styles: [`
    .timeline-row {
      display: block;
      position: relative;
      border-bottom: 1px dotted grey;
      width: 100%;
      /*right: 0;*/
    }

    .timeline-row-container {
      min-height: 21px;
    }

    .highlight {
      background-color: #42A948;
    }

    .timeline-row-content {
      overflow: visible;
      white-space: nowrap;
      height: 100%;
    }
  `]
})
export class TimelineRowComponent implements OnChanges {
  @Input()
  timelineRow: TimelineRow;
  @Input()
  timeScale: TimeScale;
  @Output()
  timelineRowChanged = new EventEmitter();
  @Output()
  timelineObjectMove = new EventEmitter();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['timelineRow']) {
      this.timelineRow = changes['timelineRow'].currentValue;
      this.timelineRowChanged.emit(this.timelineRow);
    }
    if (changes['timeScale']) {
      this.timeScale = changes['timeScale'].currentValue;
    }
  }

  handleTimelineObjectChanged(event: TimelineObject) {
    this.timelineRowChanged.emit(this.timelineRow);
  }
}
