import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { BBColorGradientEffect } from '../../../animations/animation.service';
import { TimeScale } from '../../timeline.component';

@Component({
  selector: 'bb-color-gradient-effect',
  template: `
    <div class="effect-color-gradient">
      <bb-color-picker [color]="effect.startColor" [toolTip]="'Start color of gradient'"></bb-color-picker>
      <bb-color-picker [color]="effect.endColor" [toolTip]="'End color of gradient'"></bb-color-picker>
      <span class="color gradient"
            #gradientColor
            matTooltip="Gradient result"></span>
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
  `]
})
export class ColorGradientEffectComponent implements OnChanges {
  readonly type = 'color_gradient';
  @Input()
  effect: BBColorGradientEffect;
  @Input()
  scale: TimeScale;
  @ViewChild('gradientColor')
  gradientColorElement: ElementRef;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['effect']) {
      this.effect = changes['effect'].currentValue;
      const startColor = this.effect.startColor;
      const rgbStartColor = 'rgb(' + startColor.red + ',' + startColor.green + ',' + startColor.blue + ')';
      const endColor = this.effect.endColor;
      const rgbEndColor = 'rgb(' + endColor.red + ',' + endColor.green + ',' + endColor.blue + ')';
      this.gradientColorElement.nativeElement.style.setProperty('background',
        'linear-gradient(to right, ' + rgbStartColor +' 0%, ' + rgbEndColor + ' 100%)');
    }
    // console.log('Gradient ', changes);
    // this.element.nativeElement.style.setProperty('left', (this.effect.start / this.scale.pixelsPerMillisecond) / this.scale.scale + 'px');
    // this.element.nativeElement.style.setProperty('width', (this.effect.duration / this.scale.pixelsPerMillisecond) / this.scale.scale + 'px');
  }

}
