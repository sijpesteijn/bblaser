import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver, ElementRef, EventEmitter,
  Input,
  OnChanges, Output,
  SimpleChanges, Type,
  ViewChild
} from '@angular/core';
import { TimeScale } from '../../timeline.component';
import { EffectDirective } from './effect.directive';
import { EffectComponent, EffectItem } from '../../store';
import { BBEffectData } from '../../../animations/animation.service';
import { EffectService } from '../../timeline-row-object-effect/effects/effect.service';
import { BoundingRectangle, ResizeEvent } from 'angular-resizable-element';


@Component({
  selector: 'bb-timeline-row-effect',
  template: `
    <div class="timeline-row-object-effect"
         #center
         (mousedown)="downCenter($event)"
         (mousemove)="moveCenter($event)"
         (mouseup)="upCenter($event)">
      <div class="effect-container"
           #effectContainer
           (resizeStart)="handleResizeStart($event)"
           (resizing)="handleResizing($event)"
           (resizeEnd)="handleResizeEnd($event)"
           [ngStyle]="{'left.px': (this.effectData.start / this.scale.pixelsPerMillisecond) / this.scale.scale,
           'width.px': (this.effectData.duration / this.scale.pixelsPerMillisecond) / this.scale.scale}"
           mwlResizable [resizeEdges]="{left:true, right: true}">
        <ng-template effect-host></ng-template>
      </div>
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
  scale: TimeScale;
  @Input()
  maxDuration= 0;
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

  constructor(private effectService: EffectService,
              private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['effectData']) {
      this.effectData = changes['effectData'].currentValue;
      this.effectService.getEffect(this.effectData).subscribe((effect: EffectItem) => {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(effect.component);
        let viewContainerRef = this.effectHost.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<EffectComponent>componentRef.instance).setEffectData(effect.effectData);
      });
    }
    if (changes['maxDuration']) {
      this.maxDuration = changes['maxDuration'].currentValue;
    }
  }

  handleResizeStart(event: ResizeEvent) {
    console.log('Start ', event);
    this.startRectangle = event.rectangle;
    this.centerDown = false;
  }

  handleResizing(event: ResizeEvent) {
    if (event.edges.left) {
      console.log('Nu ', ((event.rectangle.left as number)));
      console.log('Start ', (this.effectData.start / this.scale.pixelsPerMillisecond));
      // this.effectData.start = (event.rectangle.left as number) - OBJECT_NAMES_WIDTH;
      // this.effectData.duration += (this.startRectangle.left as number) - (event.rectangle.left as number);
    } else if (event.edges.right) {
      this.effectData.duration = (event.rectangle.right - event.rectangle.left) * this.scale.pixelsPerMillisecond;
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
      console.log('Moving');
      if (this.effectData.start + (event.clientX - this.center_down_x) * this.scale.pixelsPerMillisecond > 0) {
        this.effectData.start = this.effectData.start + (event.clientX - this.center_down_x) * this.scale.pixelsPerMillisecond;
        if (this.effectData.start + this.effectData.duration > this.maxDuration) {
          this.effectData.start = this.maxDuration - this.effectData.duration;
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
    // if (this.center_down_x === event.x && this.center_down_y === event.y) {
    //   this.timelineObject.selected = !this.timelineObject.selected;
    // }

  }
}
