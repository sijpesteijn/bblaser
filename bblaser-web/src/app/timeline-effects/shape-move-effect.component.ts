import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BBEffectData, BBPoint } from '../animations/animation.service';
import { EffectComponent } from '../timeline/store/index';

export interface ShapeMoveEffect extends BBEffectData {
  startPosition: BBPoint;
  endPosition: BBPoint;
}

@Component({
  selector: 'bb-shape-move-effect',
  template: `
    <div class="move-effect-container" (click)="highlightObject($event)">
      <!--<span class="move-start" matTooltip="Start point">{{ '(' + effectData.startPosition.x + ', ' + effectData.startPosition.y + ')' }}</span>-->
      <span class="move-end" matTooltip="End point">{{ '(' + effectData.endPosition.x + ', ' + effectData.endPosition.y + ')' }}</span>
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
  effectData: ShapeMoveEffect;

  constructor() {}

  setEffectData(effectData: BBEffectData): void {
    this.effectData = effectData as ShapeMoveEffect;
  }

  highlightObject(event: MouseEvent) {
    console.log('Highlight');
  }
}
