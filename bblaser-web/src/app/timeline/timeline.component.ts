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
import { TimelineRowDeleteDialogComponent } from './timeline-row/timeline-row.component';
import { ResizeEvent } from 'angular-resizable-element';

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
  pixelsPerMillisecond: number;
}

export interface SideEvent {
  timelineObject: TimelineObject,
  event: MouseEvent,
  offset: number
}

const OBJECT_NAMES_WIDTH = 152;
export const LABEL_WIDTH = 400;

@Component({
  selector: 'bb-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy, OnChanges {
  private startTime: number;
  @Input()
  timelineRows: TimelineRow[] = [];

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
  timeScaleIndex = 0;
  dialogRef;

  constructor(private store: Store<timelineReducers.TimelineState>,
              public dialog: MatDialog,
              @Inject('timeScales') public timeScales: TimeScale[]) {
  }

  ngOnInit() {
    this.store.select(timelineStore.indicatorPosition).subscribe(indicator => this.position = indicator);
    this.calculateMaxTimePosition();
    this.setTimeIndication();
    this.setIndicator();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['timelineRows']) {
      const rows = changes['timelineRows'].currentValue;
      if (rows) {
        this.calculateMaxTimePosition();
        this.setTimeIndication();
        this.setIndicator();
      }
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
    this.indicatorPosition.emit(this.getIndicatorPosition()
      * this.timeScales[this.timeScaleIndex].pixelsPerMillisecond * this.timeScales[this.timeScaleIndex].scale);
  }

  mouseDownIndicator(event: MouseEvent) {
    if (event.offsetX <= this.getMaxPosition()) {
      this.moveIndicator = true;
      this.position = event.offsetX * this.timeScales[this.timeScaleIndex].scale;
      this.setIndicator();
    }
    event.preventDefault();
  }

  mouseUpIndicator() {
    this.moveIndicator = false;
  }

  moveEvent(event: MouseEvent) {
    if (event.offsetY > 0 && this.moveIndicator && event.offsetX > 0 && event.offsetX <= this.getMaxPosition()) {
      this.position = event.offsetX * this.timeScales[this.timeScaleIndex].scale;
      console.log('move ', event);
      this.setIndicator();
    }
  }

  scrollIndicator(event: Event, slave: ElementRef) {
    slave.nativeElement.scrollLeft = event.srcElement.scrollLeft;
  }

  private playPosition() {
    if (this.playing) {
      const current = new Date().getTime();
      const diff = TIMEOUT_TIME - (current - this.startTime);
      if (this.repeat && this.getIndicatorPosition() === this.getMaxPosition()) {
        this.position = 0;
      } else if (this.getIndicatorPosition() < this.getMaxPosition()) {
        if (this.position + TIMEOUT_TIME < this.maxPosition) {
          this.position += TIMEOUT_TIME;
        } else {
          this.position = this.maxPosition;
        }
      } else if (this.repeat) {
        this.position = 0;
      } else {
        this.position = this.getMaxPosition();
        this.stopPlaying();
      }
      this.setIndicator();
      this.startTime = current;
      setTimeout(() => this.playPosition(), TIMEOUT_TIME + diff);
    }
  }

  private getMaxPosition(): number {
    return this.maxPosition / this.timeScales[this.timeScaleIndex].scale / this.timeScales[this.timeScaleIndex].pixelsPerMillisecond;
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
    const biggest: TimelineObject[] = row.timelineObjects
      .sort((a: TimelineObject, b: TimelineObject) => (a.start + a.duration) - (b.start + b.duration)).reverse();
    if (biggest.length > 0) {
      if (this.maxPosition < (biggest[0].start + biggest[0].duration)) {
        this.maxPosition = (biggest[0].start + biggest[0].duration);
      } else if (this.maxPosition > (biggest[0].start + biggest[0].duration)) {
        this.calculateMaxTimePosition();
      }
      this.setTimeIndication();
    }
    this.timelineRowChanged.emit(row);
  }

  hasEffects(timelineRow: TimelineRow) {
    return timelineRow.timelineObjects.filter(timelineObject => timelineObject.effects.length > 0).length > 0;
  }

  deleteRow(event: MouseEvent, timelineRow: TimelineRow) {
    event.stopPropagation();
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

  handleClick() {
    this.store.dispatch(new timelineStore.TimeLineContainerClick());
  }

}
