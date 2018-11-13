import { Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BBRotateEffect } from '../../../animations/animation.service';
import { TimeScale } from '../../timeline.component';

@Component({
  selector: 'bb-shape-rotate-effect',
  template: `
    <div class="rotate-effect-container">
      <span matTooltip="Degrees to rotate">{{effect.degrees}}</span>
    </div>
  `,
  styles: [`
    .rotate-effect-container {
      display: flex;
    }
  `]
})
export class ShapeRotateEffectComponent implements OnChanges {
  readonly type = 'shape_rotate';
  @Input()
  effect: BBRotateEffect;
  @Input()
  scale: TimeScale;

  constructor(private element: ElementRef<HTMLElement>) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.element.nativeElement.style.setProperty('left', this.effect.start + 'px');
    // this.element.nativeElement.style.setProperty('width', this.effect.duration + 'px');
  }

}
