import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BBEffectData } from '../animations/animation.service';
import { EffectComponent } from '../timeline/store/index';

export interface ShapeRotateEffect extends BBEffectData {
  degrees: number;
}

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
  effectData: ShapeRotateEffect;

  constructor() {}

  setEffectData(effectData: BBEffectData): void {
    this.effectData = effectData as ShapeRotateEffect;
  }
}
