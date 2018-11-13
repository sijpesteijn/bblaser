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
import { OBJECT_NAMES_WIDTH, SideEvent, TimeScale } from '../timeline.component';
import { TimelineObject } from '../store/index';
import {
  BBColorGradientEffect, BBEffect,
  BBMoveEffect,
  BBPoint,
  BBResizeEffect,
  BBRotateEffect
} from '../../animations/animation.service';
import { Store } from '@ngrx/store';
import * as timelineStore from '../store';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'bb-timeline-row-object',
  template: `
    <div class="timeline-row-object-container"
         (dblclick)="showContextMenu($event)"
         (click)="hideContextMenu($event)">
      <div class="timeline-row-object"
           mwlResizable
           (resizing)="handleResizing($event)"
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
           'width.px': (timelineObject.duration / timeScale.pixelsPerMillisecond) / timeScale.scale}">
        <ul>
          <li *ngFor="let effect of timelineObject.effects">
            <bb-timeline-row-object-effect
              [effect]="effect"
              [scale]="timeScale"
              [maxDuration]="timelineObject.duration"
              (effectChanged)="handleEffectChanged($event)"
            >
              <bb-color-gradient-effect [scale]="timeScale" [effect]="effect"
                                        *ngIf="effect.type === 'color_gradient'"></bb-color-gradient-effect>
              <bb-shape-move-effect [scale]="timeScale" [effect]="effect"
                                    *ngIf="effect.type === 'shape_move'"></bb-shape-move-effect>
              <bb-shape-rotate-effect [scale]="timeScale" [effect]="effect"
                                      *ngIf="effect.type === 'shape_rotate'"></bb-shape-rotate-effect>
              <bb-shape-resize-effect [scale]="timeScale" [effect]="effect"
                                      *ngIf="effect.type === 'shape_resize'"></bb-shape-resize-effect>
            </bb-timeline-row-object-effect>
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

  handleResizing(event: ResizeEvent) {
    console.log(event);
    if (event.edges.left) {
      this.timelineObject.start += (event.edges.left) as number * this.timeScale.pixelsPerMillisecond;
      this.timelineObject.duration -= (event.edges.left) as number / this.timeScale.pixelsPerMillisecond;
    } else if (event.edges.right) {
      this.timelineObject.duration = (event.rectangle.right - event.rectangle.left) * this.timeScale.pixelsPerMillisecond;
    }
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
  }

  moveCenter(event: MouseEvent) {
    if (this.center_down) {
      event.preventDefault();
      this.timelineObject.start = this.timelineObject.start + (event.clientX - this.center_down_x) * this.timeScale.pixelsPerMillisecond;
      this.center_down_y = -1;
      this.center_down_x = event.clientX;
      this.timelineObjectChanged.emit(this.timelineObject);
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

  handleEffectChanged(effect: BBEffect) {
    this.timelineObjectChanged.emit(this.timelineObject);
  }
}
