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
import { OBJECT_NAMES_WIDTH, TimeScale } from '../timeline.component';
import { TimelineObject } from '../store/index';
import {
  BBColorEffect,
  BBMoveEffect,
  BBPoint,
  BBResizeEffect,
  BBRotateEffect
} from '../../animations/animation.service';

@Component({
  selector: 'bb-timeline-row-object',
  template: `
    <div class="timeline-row-object-container"
         (dblclick)="showContextMenu($event)">
      <div class="timeline-row-object"
           #timelineRowObject
           [ngClass]="{'selected': timelineObject.selected, 'highlight': timelineObject.highlight}"
           [ngStyle]="{'left.px': (timelineObject.start / timeScale.pixelsPerTick) / timeScale.scale,
           'width.px': (timelineObject.duration / timeScale.pixelsPerTick) / timeScale.scale}"
           (mouseover)="handleMouseOver()"
           (mouseout)="handleMouseOut()">
      <span class="left cursor"
            (mousedown)="leftDown($event)"
            (mouseup)="leftUp($event)"></span>
        <span class="center cursor"
              (mousedown)="downCenter($event)"
              (mousemove)="moveCenter($event)"
              (mouseup)="upCenter($event)">
      </span>
        <span class="right cursor"
              (mousedown)="rightDown($event)"
              (mouseup)="rightUp($event)"></span>
      </div>
      <div class="timeline-row-object-effects" *ngIf="expanded"
           [ngStyle]="{'left.px': timelineObject.start, 'width.px': timelineObject.duration}">
        <ul>
          <li *ngFor="let effect of timelineObject.effects">
            <bb-timeline-row-object-effect [effect]="effect">
              <bb-color-gradient-effect *ngIf="effect.type === 'color_gradient'"></bb-color-gradient-effect>
              <bb-shape-move-effect *ngIf="effect.type === 'shape_move'"></bb-shape-move-effect>
              <bb-shape-rotate-effect *ngIf="effect.type === 'shape_rotate'"></bb-shape-rotate-effect>
              <bb-shape-resize-effect *ngIf="effect.type === 'shape_resize'"></bb-shape-resize-effect>
            </bb-timeline-row-object-effect>
          </li>
        </ul>
      </div>
      <bb-timeline-row-object-contextmenu [point]="point" *ngIf="contextMenu === true"
                                          (onTypeChange)="addEffect($event)"></bb-timeline-row-object-contextmenu>
    </div>
  `,
  styleUrls: ['timeline-row-object.scss']
})
export class TimelineRowObjectComponent implements OnChanges {
  @Input()
  timelineObject: TimelineObject;
  @Input()
  expanded = false;
  @Input()
  timeScale: TimeScale;
  @Output()
  leftEvent = new EventEmitter();
  @Output()
  rightEvent = new EventEmitter();
  @Output()
  timelineObjectChanged = new EventEmitter();
  @Output()
  timelineObjectMove = new EventEmitter();
  @ViewChild('timelineRowObject')
  private timelineRowObject: ElementRef;
  private center_down = false;
  private center_down_x: number;
  private center_down_y: number;
  private wasHighlighted = false;
  contextMenu = false;
  point: BBPoint;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeScale']) {
      this.timeScale = changes['timeScale'].currentValue;
    }
  }

  leftDown(event: MouseEvent) {
    this.leftEvent.emit({
      event: event,
      leftOffset: (event.x - OBJECT_NAMES_WIDTH) - this.timelineObject.start,
      timelineObject: this.timelineObject
    });
  }

  leftUp(event: MouseEvent) {
    this.leftEvent.emit();
  }

  rightDown(event: MouseEvent) {
    this.rightEvent.emit({
      event: event,
      rightOffset: (event.x - OBJECT_NAMES_WIDTH) - this.timelineObject.duration,
      timelineObject: this.timelineObject
    });
  }

  rightUp(event: MouseEvent) {
    this.rightEvent.emit();
  }

  downCenter(event: MouseEvent) {
    event.preventDefault();
    this.center_down_x = event.x;
    this.center_down_y = event.y;
    this.center_down = true;
    this.contextMenu = false;
    if (event.shiftKey) {
      console.log('Select multiple');
    }
  }

  upCenter(event: MouseEvent) {
    if (this.center_down_x === event.x && this.center_down_y === event.y) {
      this.timelineObject.selected = !this.timelineObject.selected;
    }
    this.center_down = false;
    this.timelineObjectChanged.emit(this.timelineObject);
  }

  outCenter(event: MouseEvent) {
    this.center_down = false;
  }

  moveCenter(event: MouseEvent) {
    if (this.center_down) {
      event.preventDefault();
      this.timelineObject.start = this.timelineObject.start + (event.clientX - this.center_down_x);
      this.center_down_y = -1;
      this.center_down_x = event.clientX;
      this.timelineObjectMove.emit(this.timelineRowObject);
    }
  }

  highlightObject(highlight: boolean) {
    if (highlight) {
      this.wasHighlighted = this.timelineObject.highlight;
      this.timelineObject.highlight = highlight;
    } else {
      this.timelineObject.highlight = this.wasHighlighted;
    }
  }

  showContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenu = true;
    this.point = {x: event.layerX, y: event.layerY};
  }

  handleMouseOver() {
    this.highlightObject(true);
  }

  handleMouseOut() {
    this.highlightObject(false);
    if (this.center_down) {
      this.center_down = false;
    }
  }

  addEffect(type: string) {
    if (type === 'color_gradient') {
      this.timelineObject.effects.push(({
        id: 1,
        type: 'color_gradient',
        name: 'gradient',
        start: this.timelineObject.start,
        duration: this.timelineObject.duration,
        startColor: {red: 255, green: 0, blue: 0},
        endColor: {red: 255, green: 0, blue: 255}
      }) as BBColorEffect);
    } else if (type === 'shape_move') {
      this.timelineObject.effects.push(({
        id: 1,
        type: 'shape_move',
        name: 'move',
        start: this.timelineObject.start + 40,
        duration: this.timelineObject.duration,
        startPosition: { x: 0, y: 0},
        endPosition: {x: 65535, y: 65535}
      }) as BBMoveEffect);
    } else if (type === 'shape_resize') {
      this.timelineObject.effects.push(({
        id: 1,
        type: 'shape_resize',
        name: 'resize',
        start: this.timelineObject.start + 40,
        duration: this.timelineObject.duration,
        scale: 1
      }) as BBResizeEffect);
    } else if (type === 'shape_rotate') {
      this.timelineObject.effects.push(({
        id: 1,
        type: 'shape_rotate',
        name: 'rotate',
        start: this.timelineObject.start + 40,
        duration: this.timelineObject.duration,
        degrees: 165
      }) as BBRotateEffect);
    }
    this.timelineObjectChanged.emit(this.timelineObject);
  }
}
