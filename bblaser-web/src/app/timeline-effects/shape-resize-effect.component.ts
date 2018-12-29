import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BBEffectData } from '../animations/animation.service';
import { EffectComponent } from '../timeline/store/index';

export interface ShapeResizeEffect extends BBEffectData {
  scale: number;
}

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
  effectData: ShapeResizeEffect;

  constructor() {}

  setEffectData(effectData: BBEffectData): void {
    this.effectData = effectData as ShapeResizeEffect;
  }

}
