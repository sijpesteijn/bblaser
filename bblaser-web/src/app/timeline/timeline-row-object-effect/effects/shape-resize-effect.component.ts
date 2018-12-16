import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BBColorGradientEffect, BBEffectData, BBResizeEffect } from '../../../animations/animation.service';
import { TimeScale } from '../../timeline.component';
import { EffectComponent } from '../../store';

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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShapeResizeEffectComponent implements EffectComponent {
  readonly type = 'shape_resize';
  effectData: BBResizeEffect;

  constructor() {}

  setEffectData(effectData: BBEffectData): void {
    this.effectData = effectData as BBResizeEffect;
  }

}
