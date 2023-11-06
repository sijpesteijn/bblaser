import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { OBJECT_NAMES_WIDTH, TimeScale } from '../timeline.component';
import { TimelineObject } from '../store/index';
import { BBEffectData, BBPoint } from '../../animations/animation.service';
import { Store } from '@ngrx/store';
import * as timelineStore from '../store';
import { BoundingRectangle, ResizeEvent } from 'angular-resizable-element';
import { EffectService } from '../../timeline-effects/effect.service';

@Component({
  selector: 'bb-timeline-row-object',
  template: `
    <div class="timeline-row-object-container"
         (dblclick)="showContextMenu($event)"
         (click)="hideContextMenu($event)">
      <div class="timeline-row-object"
           mwlResizable
           (resizeStart)="handleResizeStart($event)"
           (resizing)="handleResizing($event)"
           (resizeEnd)="handleResizeEnd($event)"
           [resizeEdges]="{left: true, right: true}"
           #timelineRowObject
           [ngStyle]="{'left.px': timelineObject.start / timeScale.pixelsPerMillisecond / timeScale.scale,
           'width.px': timelineObject.duration / timeScale.pixelsPerMillisecond / timeScale.scale}"
           (mouseout)="handleMouseOut()">
        <span class="center"
              (mousedown)="downCenter($event)"
              (mousemove)="moveCenter($event)"
              (mouseup)="upCenter($event)">
        </span>
      </div>
      <div class="timeline-row-object-effects" *ngIf="expanded"
           [ngStyle]="{'left.px': (timelineObject.start / timeScale.pixelsPerMillisecond) / timeScale.scale, 
           'width.px': (timelineObject.duration / timeScale.pixelsPerMillisecond) / timeScale.scale}">
        <ul>
          <li *ngFor="let effect of timelineObject.effects">
            <bb-timeline-row-effect
              [parentStart]="timelineObject.start"
              [parentDuration]="timelineObject.duration"
              [effectData]="effect"
              [timeScale]="timeScale"
              (effectChanged)="handleEffectChanged($event)"></bb-timeline-row-effect>
          </li>
        </ul>
      </div>
      <bb-timeline-row-object-context-menu [point]="point" *ngIf="contextMenu === true"
                                           (typeChanged)="addEffect($event)"></bb-timeline-row-object-context-menu>
    </div>
  `,
  styleUrls: ['timeline-row-object.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineRowObjectComponent implements OnChanges, OnInit {
  @Input()
  timelineObject: TimelineObject;
  @Input()
  expanded = false;
  @Input()
  timeScale: TimeScale;
  @Output()
  timelineObjectChanged = new EventEmitter();
  @ViewChild('timelineRowObject')
  private elementRef: ElementRef;
  private center_down = false;
  private center_down_x: number;
  private center_down_y: number;
  contextMenu = false;
  point: BBPoint;
  private startRectangle: BoundingRectangle;

  constructor(private effectService: EffectService,
              private store: Store<timelineStore.TimelineState>) {
  }

  ngOnInit() {
    this.store.select(timelineStore.selected)
      .subscribe(rowObjects => {
        if (rowObjects.filter(ro => ro.id === this.timelineObject.id).length > 0) {
          this.timelineObject.selected = true;
          this.elementRef.nativeElement.classList.add('selected');
        } else {
          this.contextMenu = false;
          this.timelineObject.selected = false;
          this.elementRef.nativeElement.classList.remove('selected');
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  handleResizeStart(event: ResizeEvent) {
    this.startRectangle = event.rectangle;
  }

  handleResizing(event: ResizeEvent) {
    if (event.edges.left) {
      this.timelineObject.start = (event.rectangle.left - OBJECT_NAMES_WIDTH) * this.timeScale.pixelsPerMillisecond;
      if (this.timelineObject.start < 0) {
        this.timelineObject.start = 0;
      } else {
        this.timelineObject.duration = event.rectangle.width * this.timeScale.pixelsPerMillisecond;
      }
    } else if (event.edges.right) {
      this.timelineObject.duration = (event.rectangle.right - event.rectangle.left) * this.timeScale.pixelsPerMillisecond;
    }
  }

  handleResizeEnd(evnet: ResizeEvent) {
    this.timelineObjectChanged.emit(this.timelineObject);
  }

  downCenter(event: MouseEvent) {
    event.preventDefault();
    this.center_down_x = event.x;
    this.center_down_y = event.y;
    this.center_down = true;
    this.timelineObject.selected = true;
    if (event.shiftKey) {
      // console.log('Select multiple');
      this.store.dispatch(new timelineStore.TimelineAddToSelected(this.timelineObject));
    } else {
      this.store.dispatch(new timelineStore.TimelineSetSelected([this.timelineObject]));
    }
  }

  upCenter(event: MouseEvent) {
    if (this.center_down_x === event.x && this.center_down_y === event.y) {
      this.timelineObject.selected = !this.timelineObject.selected;
    }
    this.center_down = false;
    this.timelineObjectChanged.emit(this.timelineObject);
  }

  moveCenter(event: MouseEvent) {
    if (this.center_down) {
      event.preventDefault();
      if (this.timelineObject.start + (event.clientX - this.center_down_x) * this.timeScale.pixelsPerMillisecond > 0) {
        this.timelineObject.start = this.timelineObject.start + (event.clientX - this.center_down_x) * this.timeScale.pixelsPerMillisecond;
      } else {
        this.timelineObject.start = 0;
      }
      this.center_down_y = -1;
      this.center_down_x = event.clientX;
    }
  }

  showContextMenu(event: MouseEvent) {
    event.stopPropagation();
    this.point = {
      x: (this.timelineObject.start / this.timeScale.pixelsPerMillisecond / this.timeScale.scale) + event.clientX,
      y: event.clientY
    };
    this.contextMenu = true;
    this.store.dispatch(new timelineStore.TimelineSetSelected([this.timelineObject]));
  }

  hideContextMenu(event: MouseEvent) {
    event.stopPropagation();
    this.contextMenu = false;
  }

  handleMouseOut() {
    this.center_down = false;
  }

  addEffect(type: string) {
    this.timelineObject.effects.push(this.effectService.addNewEffect(type, this.timelineObject.duration));
    this.timelineObjectChanged.emit(this.timelineObject);
  }

  handleEffectChanged(effect: BBEffectData) {
    this.timelineObjectChanged.emit(this.timelineObject);
  }
}
