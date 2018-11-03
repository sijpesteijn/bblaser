import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TimelineObject, TimelineRow } from '../store/index';
import { TimeScale } from '../timeline.component';

@Component({
  selector: 'bb-timeline-row',
  template: `
    <div class="timeline-row">
      <div class="timeline-row-container"
           [ngClass]="{'selected': timelineRow.selected, 'highlight': timelineRow.highlight}">
        <div class="timeline-row-content">
          <bb-timeline-row-object *ngFor="let timelineObject of timelineRow.timelineObjects"
                                  [timelineObject]="timelineObject"
                                  [timeScale]="timeScale"
                                  [expanded]="timelineRow.expanded"
                                  (leftEvent)="handleLeftTimelineObjectEvent($event)"
                                  (rightEvent)="handleRightTimelineObjectEvent($event)"
                                  (timelineObjectChanged)="handleTimelineObjectChanged($event)"
                                  (timelineObjectMove)="handleTimelineObjectMove($event)">
          </bb-timeline-row-object>
        </div>
      </div>
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
      overflow: hidden;
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
  @Output()
  leftEvent = new EventEmitter();
  @Output()
  rightEvent = new EventEmitter();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['timelineRow']) {
      this.timelineRow = changes['timelineRow'].currentValue;
      this.timelineRowChanged.emit(this.timelineRow);
    }
    if (changes['timeScale']) {
      this.timeScale = changes['timeScale'].currentValue;
    }
  }

  handleLeftTimelineObjectEvent(event: any) {
    this.leftEvent.emit(event);
  }

  handleRightTimelineObjectEvent(event: any) {
    this.rightEvent.emit(event);
  }

  handleTimelineObjectChanged(event: TimelineObject) {
    if (event) {
      this.timelineRowChanged.emit(this.timelineRow);
    }
  }

  handleTimelineObjectMove(event: TimelineObject) {
    if (event) {
      this.timelineObjectMove.emit(event);
    }
  }
}
