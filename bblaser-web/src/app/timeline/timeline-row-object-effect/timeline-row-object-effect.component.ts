import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { BBEffectData } from '../../animations/animation.service';
import { TimeScale } from '../timeline.component';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'bb-timeline-row-object-effect',
  template: `
    <div class="timeline-row-object-effect"
         (mousedown)="downCenter($event)"
         (mousemove)="moveCenter($event)"
         (mouseup)="upCenter($event)" #center>
      <div class="effect-container"
           #effect
           (resizing)="handleResizing($event)"
           mwlResizable [resizeEdges]="{left:true, right: true}">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .timeline-row-object-effect {
      height: 22px;
      width: 100%;
    }

    .effect-container {
      background-color: white;
      border: 1px solid #bababa;
      position: relative;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineRowObjectEffectComponent implements OnChanges {
  @Input()
  effect: BBEffectData;
  @Input()
  scale: TimeScale;
  @Input()
  maxDuration = 100;
  @ViewChild('effect')
  effectElement: ElementRef;
  centerDown = false;
  private center_down_x: number;
  private center_down_y: number;
  @Output()
  private effectChanged: EventEmitter<BBEffectData> = new EventEmitter();


  constructor(private element: ElementRef<HTMLElement>) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['maxDuration']) {
      this.maxDuration = changes['maxDuration'].currentValue;
    }
    // this.element.nativeElement.style.setProperty('background-image', 'linear-gradient(-90deg, ' + this.getRGBColor((this.effectData as BBColorGradientEffect).startColor) + ', ' +
    //   '' + this.getRGBColor((this.effectData as BBColorGradientEffect).endColor) + ')');
    this.setPosition();
  }

  private setPosition() {
    if (this.effect.start + this.effect.duration >= this.maxDuration) {
      this.effect.duration = this.maxDuration - this.effect.start;
    }
    this.effectElement.nativeElement.style.setProperty('left', (this.effect.start / this.scale.pixelsPerMillisecond) / this.scale.scale + 'px');
    this.effectElement.nativeElement.style.setProperty('width', (this.effect.duration / this.scale.pixelsPerMillisecond) / this.scale.scale + 'px');
    this.effectChanged.emit(this.effect);
  }

  handleResizing(event: ResizeEvent) {
    if (event.edges.left) {
      this.effect.start = (event.edges.left) as number * this.scale.pixelsPerMillisecond;
    } else if (event.edges.right) {
      this.effect.duration = (event.rectangle.right - event.rectangle.left) * this.scale.pixelsPerMillisecond;
    }
    this.setPosition();
  }

  downCenter(event: MouseEvent) {
    this.centerDown = true;
    this.center_down_x = event.x;
    this.center_down_y = event.y;

  }

  moveCenter(event: MouseEvent) {
    if (this.centerDown) {
      this.effect.start = this.effect.start + (event.clientX - this.center_down_x) * this.scale.pixelsPerMillisecond;
      this.center_down_y = -1;
      this.center_down_x = event.clientX;
      this.setPosition();
    }
  }

  upCenter(event: MouseEvent) {
    this.centerDown = false;
    // if (this.center_down_x === event.x && this.center_down_y === event.y) {
    //   this.timelineObject.selected = !this.timelineObject.selected;
    // }

  }
}
