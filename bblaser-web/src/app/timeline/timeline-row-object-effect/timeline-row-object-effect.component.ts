import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BBColorEffect, BBEffect } from '../../animations/animation.service';

@Component({
  selector: 'bb-timeline-row-object-effect',
  template: `
    <div class="timeline-row-object-effect"
         [ngStyle]="getStyles()">
    <span class="left cursor"
          (mousedown)="leftDown($event)"
          (mouseup)="leftUp($event)"></span>
      <span class="center cursor"
            (mousedown)="downCenter($event)"
            (mousemove)="moveCenter($event)"
            (mouseup)="upCenter($event)" #center>
            <ng-content></ng-content>
            </span>
      <span class="right cursor"
            (mousedown)="rightDown($event)"
            (mouseup)="rightUp($event)"></span>
    </div>
  `,
  styleUrls: ['timeline-row-object-effect.scss']
})
export class TimelineRowObjectEffectComponent {
  @Input()
  effect: BBEffect;
  @ViewChild('center')
  center: ElementRef;

  leftDown(event: MouseEvent) {

  }

  leftUp(event: MouseEvent) {

  }

  downCenter(event: MouseEvent) {

  }

  moveCenter(event: MouseEvent) {

  }

  upCenter(event: MouseEvent) {

  }

  rightDown(event: MouseEvent) {

  }

  rightUp(event: MouseEvent) {

  }

  getStyles() {
    return {
      'left.px': this.effect.start,
      'width.px': this.effect.duration,
      'background-image': 'linear-gradient(-90deg, #' + (this.effect as BBColorEffect).startColor + ', #' +
        (this.effect as BBColorEffect).endColor + ')'
    };
  }
}
