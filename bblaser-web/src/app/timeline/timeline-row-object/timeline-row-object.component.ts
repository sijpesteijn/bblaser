import {
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
import { TimeScale } from '../timeline.component';
import { TimelineObject } from '../store/index';
import {
  BBColorGradientEffect,
  BBEffectData,
  BBMoveEffect,
  BBPoint,
  BBResizeEffect,
  BBRotateEffect
} from '../../animations/animation.service';
import { Store } from '@ngrx/store';
import * as timelineStore from '../store';
import { BoundingRectangle, ResizeEvent } from 'angular-resizable-element';

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
           [ngStyle]="{'left.px': (timelineObject.start / timeScale.pixelsPerMillisecond) / timeScale.scale,
           'width.px': (timelineObject.duration / timeScale.pixelsPerMillisecond) / timeScale.scale}"
           (mouseout)="handleMouseOut()">
        <span class="center"
              (mousedown)="downCenter($event)"
              (mousemove)="moveCenter($event)"
              (mouseup)="upCenter($event)">
        </span>
      </div>
      <div class="timeline-row-object-effects" *ngIf="expanded"
           [ngStyle]="{'left.px': (timelineObject.start / timeScale.pixelsPerMillisecond) / timeScale.scale, 
           'width.px': (timelineObject.duration / timeScale.pixelsPerMillisecond) / timeScale.scale,
            'height.px': 24 + (timelineObject.effects.length * 22)}">
        <ul>
          <li *ngFor="let effect of timelineObject.effects">
            <bb-timeline-row-effect
              [effectData]="effect"
              [scale]="timeScale"
              [maxDuration]="timelineObject.duration"
              (effectChanged)="handleEffectChanged($event)"></bb-timeline-row-effect>
          </li>
        </ul>
      </div>
      <bb-timeline-row-object-context-menu [point]="point" *ngIf="contextMenu === true"
                                           (typeChanged)="addEffect($event)"></bb-timeline-row-object-context-menu>
    </div>
  `,
  styleUrls: ['timeline-row-object.scss']
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

  constructor(private store: Store<timelineStore.TimelineState>) {
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
    if (changes['timeScale']) {
      this.timeScale = changes['timeScale'].currentValue;
    }
  }

  handleResizeStart(event: ResizeEvent) {
    console.log('Start ', event);
    this.startRectangle = event.rectangle;
  }

  handleResizing(event: ResizeEvent) {
    if (event.edges.left) {
      console.log('RStart ', this.timelineObject.start);
      // console.log('Start ', this.startRectangle.left + event.edges.left);
      // console.log('Event ', event.edges.left);
      // this.timelineObject.start = (this.startRectangle.left + event.edges.left) / this.timeScale.pixelsPerMillisecond;
      // const start = this.timelineObject.start;
      // this.timelineObject.start = (event.rectangle.left - OBJECT_NAMES_WIDTH) * this.timeScale.pixelsPerMillisecond;
      // this.timelineObject.duration -= this.timelineObject.start - start;
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
      console.log('Select multiple');
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
    this.contextMenu = true;
    this.point = {
      x: (this.timelineObject.start / this.timeScale.pixelsPerMillisecond / this.timeScale.scale) + event.layerX,
      y: event.layerY
    };
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
    if (type === 'color_gradient') {
      this.timelineObject.effects.push(({
        id: 1,
        type: 'color_gradient',
        name: 'gradient',
        start: 0,
        duration: this.timelineObject.duration,
        startColor: {red: 255, green: 0, blue: 0},
        endColor: {red: 255, green: 0, blue: 255}
      }) as BBColorGradientEffect);
    } else if (type === 'shape_move') {
      this.timelineObject.effects.push(({
        id: 1,
        type: 'shape_move',
        name: 'move',
        start: 0,
        duration: this.timelineObject.duration,
        startPosition: {x: 0, y: 0},
        endPosition: {x: 65535, y: 65535}
      }) as BBMoveEffect);
    } else if (type === 'shape_resize') {
      this.timelineObject.effects.push(({
        id: 1,
        type: 'shape_resize',
        name: 'resize',
        start: 0,
        duration: this.timelineObject.duration,
        scale: 1
      }) as BBResizeEffect);
    } else if (type === 'shape_rotate') {
      this.timelineObject.effects.push(({
        id: 1,
        type: 'shape_rotate',
        name: 'rotate',
        start: 0,
        duration: this.timelineObject.duration,
        degrees: 360
      }) as BBRotateEffect);
    }
    this.timelineObjectChanged.emit(this.timelineObject);
  }

  handleEffectChanged(effect: BBEffectData) {
    this.timelineObjectChanged.emit(this.timelineObject);
  }
}
