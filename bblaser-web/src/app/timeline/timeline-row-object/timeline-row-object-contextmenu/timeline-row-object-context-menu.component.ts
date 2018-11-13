import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BBPoint } from '../../../animations/animation.service';

@Component({
  selector: 'bb-timeline-row-object-context-menu',
  template: `
    <div class="context-menu" [ngStyle]="{'left.px': point.x, 'top.px': point.y}">
      <mat-card>
        <ul>
          <li><button mat-button (click)="addEffect($event, 'color_gradient')">Gradient</button></li>
          <li><button mat-button (click)="addEffect($event, 'shape_move')">Move</button></li>
          <li><button mat-button (click)="addEffect($event, 'shape_resize')">Resize</button></li>
          <li><button mat-button (click)="addEffect($event, 'shape_rotate')">Rotate</button></li>
        </ul>
      </mat-card>
    </div>
  `,
  styles: [`
    .context-menu {
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
export class TimelineRowObjectContextMenuComponent {
  @Input()
  point: BBPoint;

  @Output()
  typeChanged: EventEmitter<string> = new EventEmitter();

  addEffect(event: MouseEvent, type: string) {
    this.typeChanged.emit(type);
    event.stopPropagation();
  }
}
