import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BBPoint } from '../../../animations/animation.service';

@Component({
  selector: 'bb-timeline-row-object-contextmenu',
  template: `
    <div class="contextmenu" [ngStyle]="{'left.px': point.x, 'top.px': point.y}">
      <mat-card>
        <ul>
          <li><button mat-button (click)="addEffect('color_gradient')">Gradient</button></li>
          <li><button mat-button (click)="addEffect('shape_move')">Move</button></li>
          <li><button mat-button (click)="addEffect('shape_resize')">Resize</button></li>
          <li><button mat-button (click)="addEffect('shape_rotate')">Rotate</button></li>
        </ul>
      </mat-card>
    </div>
  `,
  styles: [`
    .contextmenu {
      position: absolute;
      z-index: 100;
    }
    ul {
      padding: 5px;
      list-style: none;
    }
    li {
      font-size: 12px;
    }
    mat-card {
      padding: 0;
    }
  `]
})
export class TimelineRowObjectContextmenuComponent {
  @Input()
  point: BBPoint;

  @Output()
  onTypeChange = new EventEmitter();

  addEffect(type: string) {
    this.onTypeChange.emit(type);
  }
}
