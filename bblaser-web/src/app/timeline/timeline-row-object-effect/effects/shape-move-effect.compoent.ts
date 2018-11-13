import { Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BBColorGradientEffect } from '../../../animations/animation.service';
import { TimeScale } from '../../timeline.component';

@Component({
  selector: 'bb-shape-move-effect',
  template: `
    <div class="move-effect-container">
      <span class="move-start" matTooltip="Start point">1540, 34344</span>
      <span class="move-end" matTooltip="End point">2305, 24534</span>
    </div>
  `,
  styles: [`
  .move-effect-container {
    display: flex;
  }
  .move-start {
    
  }
  .move-end {
    margin-left: auto;
  }`]
})
export class ShapeMoveEffectComponent implements OnChanges {
  readonly type = 'shape_move';
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
