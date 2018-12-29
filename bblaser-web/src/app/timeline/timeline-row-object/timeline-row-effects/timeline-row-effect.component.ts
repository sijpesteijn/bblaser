import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { OBJECT_NAMES_WIDTH, TimeScale } from '../../timeline.component';
import { EffectDirective } from './effect.directive';
import { EffectComponent } from '../../store';
import { BBEffectData, BBPoint } from '../../../animations/animation.service';
import { EffectService } from '../../../timeline-effects/effect.service';
import { BoundingRectangle, ResizeEvent } from 'angular-resizable-element';


@Component({
  selector: 'bb-timeline-row-effect',
  template: `
    <div class="timeline-row-object-effect"
         #center
         (dblclick)="showContextMenu($event)"
         (click)="hideContextMenu($event)"
        (mousedown)="downCenter($event)"
         (mousemove)="moveCenter($event)"
         (mouseup)="upCenter($event)">
      <div class="effect-container"
           #effectContainer
           (resizeStart)="handleResizeStart($event)"
           (resizing)="handleResizing($event)"
           (resizeEnd)="handleResizeEnd($event)"
           [ngStyle]="{'left.px': (this.effectData.start / this.timeScale.pixelsPerMillisecond) / this.timeScale.scale,
           'width.px': (this.effectData.duration / this.timeScale.pixelsPerMillisecond) / this.timeScale.scale}"
           mwlResizable [resizeEdges]="{left:true, right: true}">
        <ng-template effect-host></ng-template>
      </div>
      <bb-timeline-row-effect-contextmenu [point]="point" *ngIf="contextMenu === true" [effect]="effectData"></bb-timeline-row-effect-contextmenu>
    </div>
  `,
  styles: [`
    .timeline-row-object-effect {
      width: 100%;
    }

    .effect-container {
      background-color: white;
      border: 1px solid #bababa;
      position: relative;
      height: 22px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineRowEffectComponent implements OnChanges {
  @Input()
  effectData: BBEffectData;
  @Input()
  timeScale: TimeScale;
  @Input()
  parentStart: number;
  @Input()
  parentDuration = 0;
  @Output()
  private effectChanged: EventEmitter<BBEffectData> = new EventEmitter();
  @ViewChild(EffectDirective)
  effectHost: EffectDirective;
  @ViewChild('effectContainer')
  effectContainer: ElementRef;
  centerDown = false;
  private center_down_x: number;
  private center_down_y: number;
  private startRectangle: BoundingRectangle;
  private contextMenu = false;
  private point: BBPoint;

  constructor(private effectService: EffectService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.effectData) {
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.effectService.getEffectComponent(this.effectData.type));
      let viewContainerRef = this.effectHost.viewContainerRef;
      viewContainerRef.clear();
      let componentRef = viewContainerRef.createComponent(componentFactory);
      (<EffectComponent>componentRef.instance).setEffectData(this.effectData);
    }
    if (changes.parentStart || changes.parentDuration) {
      this.updateLimits();
    }
  }

  handleResizeStart(event: ResizeEvent) {
    this.startRectangle = event.rectangle;
    this.centerDown = false;
  }

  handleResizing(event: ResizeEvent) {
    if (event.edges.left) {
      const startRowObject = OBJECT_NAMES_WIDTH + (this.parentStart / this.timeScale.pixelsPerMillisecond);
      if (event.rectangle.left >= startRowObject) {
        const start = event.rectangle.left - startRowObject;
        this.effectData.start = start * this.timeScale.pixelsPerMillisecond;
        this.effectData.duration = event.rectangle.width * this.timeScale.pixelsPerMillisecond;
      }
    } else if (event.edges.right) {
      const durationRowObject = (this.parentDuration / this.timeScale.pixelsPerMillisecond);
      if (event.rectangle.width <= durationRowObject) {
        this.effectData.duration = (event.rectangle.right - event.rectangle.left) * this.timeScale.pixelsPerMillisecond;
      }
    }
  }

  handleResizeEnd(event: ResizeEvent) {
    this.effectChanged.emit(this.effectData);
  }

  downCenter(event: MouseEvent) {
    this.centerDown = true;
    this.center_down_x = event.x;
    this.center_down_y = event.y;
  }

  moveCenter(event: MouseEvent) {
    if (this.centerDown) {
      if (this.effectData.start + (event.clientX - this.center_down_x) * this.timeScale.pixelsPerMillisecond > 0) {
        this.effectData.start = this.effectData.start + (event.clientX - this.center_down_x) * this.timeScale.pixelsPerMillisecond;
        if (this.effectData.start + this.effectData.duration > this.parentDuration) {
          this.effectData.start = this.parentDuration - this.effectData.duration;
        }
      } else {
        this.effectData.start = 0;
      }
      this.center_down_y = -1;
      this.center_down_x = event.clientX;
    }
  }

  upCenter(event: MouseEvent) {
    this.centerDown = false;
  }

  updateLimits() {
    const overShoot = (this.effectData.start + this.effectData.duration) - this.parentDuration;
    if (this.effectData.start === this.parentStart && this.effectData.duration > this.parentDuration) {
      this.effectData.duration = this.parentDuration;
    }
    if (overShoot > 0) {
      this.effectData.start -= overShoot;
    }
    if (this.effectData.duration > this.parentDuration) {
      this.effectData.duration = this.parentDuration;
      this.effectData.start = 0;
    }
  }

  showContextMenu(event: MouseEvent) {
    event.stopPropagation();
    this.point = {
      x: (this.effectData.start / this.timeScale.pixelsPerMillisecond / this.timeScale.scale) + event.layerX,
      y: event.layerY
    };
    this.contextMenu = true;
  }

  hideContextMenu(event: MouseEvent) {
    event.stopPropagation();
    this.contextMenu = false;
  }
}
