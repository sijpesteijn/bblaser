import {
  Component,
  ElementRef,
  EventEmitter, Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as timelineReducers from './store';
import * as timelineStore from './store';
import { TimelineObject, TimelineRow } from './store';
import { MatDialog } from '@angular/material';
import { AnimationDeleteDialogComponent } from '../animations/animation-delete-dialog/animation-delete-dialog.component';
import * as animationStore from '../animations/animation-store';
import { TimelineRowDeleteDialogComponent } from './timeline-row/timeline-row.component';

export const TIMEOUT_TIME = 50;

export interface Tick {
  type: string;
  offset: number;
  label?: string;
}

export interface TimeScale {
  name: string;
  postfix: string;
  scale: number; // in seconds
  pixelsPerTick: number;
}

export const OBJECT_NAMES_WIDTH = 152;
export const LABEL_WIDTH = 400;

@Component({
  selector: 'bb-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy, OnChanges {
  private startTime: number;
  @Input()
  timelineRows: TimelineRow[];

  @Output()
  private indicatorPosition: EventEmitter<number> = new EventEmitter();
  @Output()
  private timelineRowChanged: EventEmitter<TimelineRow> = new EventEmitter();
  @Output()
  private timelineRowDeleted: EventEmitter<TimelineRow> = new EventEmitter();

  @ViewChild('timelineRulerIndicator')
  private rulerIndicator: ElementRef;
  @ViewChild('timelineIndicator')
  private indicator: ElementRef;
  @ViewChild('timelineRulerScrollContainer')
  indicatorContainer: ElementRef;
  @ViewChild('timelineGroupContainer')
  groupContainer: ElementRef;

  private playing = false;
  private maxPosition = 0;
  private repeat = false;
  private moveIndicator = false;
  ticks: Tick[] = [];
  position = 0;
  leftDown: any;
  rightDown: any;
  timeScaleIndex = 0;
  dialogRef;

  constructor(private store: Store<timelineReducers.TimelineState>,
              public dialog: MatDialog,
              @Inject('timeScales') public timeScales: TimeScale[]) {
  }

  ngOnInit() {
    this.store.select(timelineStore.indicatorPosition).subscribe(indicator => this.position = indicator);
  }

  ngOnChanges(changes: SimpleChanges) {
    const rows = changes['timelineRows'].currentValue;
    if (rows) {
      this.calculateMaxTimePosition();
      this.setTimeIndication();
      this.setIndicator();
    }
  }

  private setTimeIndication() {
    let labelIndex = 0;
    const timeScale = this.timeScales[this.timeScaleIndex];
    this.ticks = [];
    for (let i = 0; i < this.getMaxPosition(); i = i + 5) {
      if (i % LABEL_WIDTH === 0) {
        this.ticks.push({type: 'label', offset: i, label:  i > 0 ? ++labelIndex + timeScale.postfix : ''});
      } else if (i % 10 === 0) {
        this.ticks.push({type: 'major', offset: i});
      } else if (i % 5 === 0) {
        this.ticks.push({type: 'minor', offset: i});
      }
    }
  }

  ngOnDestroy() {
    this.stopPlaying();
  }

  private setIndicator() {
    this.rulerIndicator.nativeElement.style.setProperty('left', (this.getIndicatorPosition() - 9) + 'px');
    this.indicator.nativeElement.style.setProperty('left', (this.getIndicatorPosition()) + 'px');
    this.indicatorPosition.emit(this.getIndicatorPosition() * this.timeScales[this.timeScaleIndex].pixelsPerTick * this.timeScales[this.timeScaleIndex].scale);
  }

  mousedownIndicator(event: MouseEvent) {
    if (event.x - OBJECT_NAMES_WIDTH <= this.getMaxPosition()) {
      this.moveIndicator = true;
      this.position = (event.x - OBJECT_NAMES_WIDTH) * this.timeScales[this.timeScaleIndex].scale;
      this.setIndicator();
      event.preventDefault();
    }
  }

  mouseupIndicator(event: MouseEvent) {
    this.moveIndicator = false;
  }

  moveEvent(event: MouseEvent) {
    if (this.moveIndicator && event.x - OBJECT_NAMES_WIDTH > 0 &&
      event.x - OBJECT_NAMES_WIDTH <= this.getMaxPosition()) {
      this.position = (event.x - OBJECT_NAMES_WIDTH) * this.timeScales[this.timeScaleIndex].scale;
      this.setIndicator();
    }
    event.preventDefault();
  }

  scrollIndicator(event: Event, slave: ElementRef) {
    slave.nativeElement.scrollLeft = event.srcElement.scrollLeft;
  }

  handleLeftTimelineObjectEvent(event: any) {
    this.leftDown = event;
  }

  handleRightTimelineObjectEvent(event: any) {
    this.rightDown = event;
  }

  handleMoveEvent(event: MouseEvent) {
    if (this.leftDown) {
      const leftStart = (event.x - OBJECT_NAMES_WIDTH - this.leftDown.leftOffset);
      this.leftDown.timelineObject.duration +=
        this.leftDown.timelineObject.start - leftStart;
      this.leftDown.timelineObject.start = leftStart;
    } else if (this.rightDown) {
      const rightStart = (event.x - OBJECT_NAMES_WIDTH - this.rightDown.rightOffset);
      this.rightDown.timelineObject.duration +=
        rightStart - this.rightDown.timelineObject.duration;
    }
  }

  stopMove(event: MouseEvent) {
    this.leftDown = undefined;
    this.rightDown = undefined;
  }

  private playPosition() {
    if (this.playing) {
      const current = new Date().getTime();
      const diff = TIMEOUT_TIME - (current - this.startTime);
      if (this.repeat && this.position === this.maxPosition) {
        this.position = 0;
      } else if (this.position < this.maxPosition) {
        if (this.position + TIMEOUT_TIME < this.maxPosition) {
          this.position += TIMEOUT_TIME;
        } else {
          this.position = this.maxPosition;
        }
      } else if (this.repeat) {
        this.position = 0;
      } else {
        this.stopPlaying();
      }
      this.setIndicator();
      this.startTime = current;
      setTimeout(() => this.playPosition(), TIMEOUT_TIME + diff);
    }
  }

  private getMaxPosition(): number {
    return this.maxPosition / this.timeScales[this.timeScaleIndex].scale / this.timeScales[this.timeScaleIndex].pixelsPerTick;
  }

  private getIndicatorPosition(): number {
    return this.position / this.timeScales[this.timeScaleIndex].scale;
  }

  private calculateMaxTimePosition() {
    const biggest: TimelineObject[] = this.timelineRows
      .map(value => value.timelineObjects)
      .reduce((previousValue, currentValue) => previousValue.concat(currentValue), [])
      .sort((a: TimelineObject, b: TimelineObject) => (a.start + a.duration) - (b.start + b.duration))
      .reverse();
    if (biggest.length > 0) {
      this.maxPosition = (biggest[0].start + biggest[0].duration);
    } else {
      this.maxPosition = 0;
    }
  }

  handleTimelineRowChanged(row: TimelineRow) {
    const biggest = row.timelineObjects.reduce((previousValue, currentValue) => previousValue.concat(currentValue), [])
      .sort((a: TimelineObject, b: TimelineObject) => (a.start + a.duration) - (b.start + b.duration))
      .reverse();
    if (biggest.length > 0) {
      if (this.maxPosition < (biggest[0].start + biggest[0].duration)) {
        this.maxPosition = (biggest[0].start + biggest[0].duration);
        this.setTimeIndication();
      } else if (this.maxPosition > (biggest[0].start + biggest[0].duration)) {
        this.calculateMaxTimePosition();
        this.setTimeIndication();
      }
    }
    this.timelineRowChanged.emit(row);
  }

  hasEffects(timelineRow: TimelineRow) {
    return timelineRow.timelineObjects.filter(timelineObject => timelineObject.effects.length > 0).length > 0;
  }

  deleteRow(timelineRow: TimelineRow) {
    this.dialogRef = this.dialog.open(TimelineRowDeleteDialogComponent, {
      data: timelineRow
    });

    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.timelineRowDeleted.emit(timelineRow);
      }
    });
  }

  isPlaying() {
    return this.playing;
  }

  startPlaying() {
    this.startTime = new Date().getTime();
    this.playing = true;
    setTimeout(() => this.playPosition(), TIMEOUT_TIME);
  }

  stopPlaying() {
    this.playing = false;
  }

  rewind() {
    this.stopPlaying();
    this.position = 0;
    this.setIndicator();
  }

  loop() {
    this.repeat = !this.repeat;
  }

  zoomOut() {
    if (this.timeScaleIndex < this.timeScales.length - 1) {
      this.timeScaleIndex++;
      this.setTimeIndication();
      this.setIndicator();
    }
  }

  zoomIn() {
    if (this.timeScaleIndex > 0) {
      this.timeScaleIndex--;
      this.setTimeIndication();
      this.setIndicator();
    }
  }

  handleClick(event) {
    this.store.dispatch(new timelineStore.TimeLineContainerClick());
  }

}
