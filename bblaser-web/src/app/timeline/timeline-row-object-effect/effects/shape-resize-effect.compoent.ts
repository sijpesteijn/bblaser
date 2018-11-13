import { Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BBColorGradientEffect } from '../../../animations/animation.service';
import { TimeScale } from '../../timeline.component';

@Component({
  selector: 'bb-shape-resize-effect',
  template: `
    <div class="resize-effect-container">
      <span class="resize_end" matTooltip="End Size">0.5</span>
    </div>
  `,
  styles: [`
    .resize-effect-container {
      display: flex;
    }

    .resize_end {
      margin-left: auto;
    }
  `]
})
export class ShapeResizeEffectComponent implements OnChanges {
  readonly type = 'shape_resize';
  @Input()
  effect: BBColorGradientEffect;
  @Input()
  scale: TimeScale;

  constructor(private element: ElementRef<HTMLElement>) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.element.nativeElement.style.setProperty('left', this.effect.start + 'px');
    this.element.nativeElement.style.setProperty('width', this.effect.duration + 'px');
  }

}
