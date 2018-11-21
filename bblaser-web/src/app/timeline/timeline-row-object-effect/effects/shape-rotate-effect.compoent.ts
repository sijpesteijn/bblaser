import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BBEffectData, BBRotateEffect } from '../../../animations/animation.service';
import { EffectComponent } from '../../store';

@Component({
  selector: 'bb-shape-rotate-effect',
  template: `
    <div class="rotate-effect-container">
      <span matTooltip="Degrees to rotate" [innerHTML]="effectData.degrees"></span>
    </div>
  `,
  styles: [`
    .rotate-effect-container {
      display: flex;
      cursor: move;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShapeRotateEffectComponent implements EffectComponent {
  readonly type = 'shape_rotate';
  effectData: BBRotateEffect;

  constructor() {}

  setEffectData(effectData: BBEffectData): void {
    this.effectData = effectData as BBRotateEffect;
  }
}
