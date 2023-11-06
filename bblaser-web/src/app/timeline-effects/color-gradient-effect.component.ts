import {
  ChangeDetectionStrategy,
  Component,
  ElementRef, Type,
  ViewChild
} from '@angular/core';
import * as onecolor from 'onecolor';
import * as paper from 'paper';
import { BBColor, BBEffectData } from '../animations/animation.service';
import { EffectComponent } from '../timeline/store/index';
import { TimeScale } from '../timeline/timeline.component';

// const COLOR_GRADIENT = "color_gradient";

export interface ColorGradientEffect extends BBEffectData {
  startColor: BBColor;
  endColor: BBColor;
}

@Component({
  selector: 'bb-color-gradient-effect',
  template: `
    <div class="effect-color-gradient">
      <!-- <bb-radial-color-picker [color]="effectData.startColor" [toolTip]="'Start color of gradient'"></bb-radial-color-picker>
      <bb-radial-color-picker [color]="effectData.endColor" [toolTip]="'End color of gradient'"></bb-radial-color-picker>
      <span class="color gradient"
            #gradientColor
            matTooltip="Gradient result"></span> -->
    </div>
  `,
  styles: [`
    .effect-color-gradient {
      display: flex;
    }
    .color {
      width: 13px;
      height: 13px;
      border-radius: 20px;
      margin-right: 3px;
    }
    .gradient {
      width: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorGradientEffectComponent implements EffectComponent {
  readonly type = 'color_gradient';
  effectData: ColorGradientEffect;
  @ViewChild('gradientColor')
  gradientColorElement: ElementRef;

  constructor() {
  }

  setEffectData(effectData: BBEffectData): void {
      this.effectData = effectData as ColorGradientEffect;
      const startColor = this.effectData.startColor;
      const rgbStartColor = 'rgb(' + startColor.red + ',' + startColor.green + ',' + startColor.blue + ')';
      const endColor = this.effectData.endColor;
      const rgbEndColor = 'rgb(' + endColor.red + ',' + endColor.green + ',' + endColor.blue + ')';
      this.gradientColorElement.nativeElement.style.setProperty('background',
        'linear-gradient(to right, ' + rgbStartColor +' 0%, ' + rgbEndColor + ' 100%)');
  }

}
