import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BBEffectData, BBMoveEffect } from '../../../animations/animation.service';
import { EffectComponent } from '../../store';

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
  }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShapeMoveEffectComponent implements EffectComponent {
  readonly type = 'shape_move';
  effectData: BBMoveEffect;

  constructor() {}

  setEffectData(effectData: BBEffectData): void {
    this.effectData = effectData as BBMoveEffect;
  }

}
