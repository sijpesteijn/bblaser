import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { BBEffectData, BBPoint } from '../../../../animations/animation.service';
import { TimelineRow } from '../../../store';

@Component({
  selector: 'bb-timeline-row-effect-contextmenu',
  template: `
    <div class="context-menu" [ngStyle]="{'left.px': point.x, 'top.px': point.y}">
      <mat-card>
        <ul>
          <li>
            <mat-icon *ngIf="effect.visible" (click)="setVisible(effect, false)">visibility</mat-icon>
            <mat-icon *ngIf="!effect.visible" (click)="setVisible(effect, true)">visibility_off</mat-icon>
          </li>
          <li>
            <mat-icon (click)="deleteRow($event, timelineRow)">delete</mat-icon>
          </li>
        </ul>
      </mat-card>
    </div>
  `,
  styles: [
    `
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
  `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineRowEffectContextmenuComponent implements OnInit {
  @Input()
  point: BBPoint;
  @Input()
  effect: BBEffectData;

  constructor() {
  }

  ngOnInit() {
  }

  setVisible(effect: BBEffectData, visibility: boolean) {
    effect.visible = visibility;
    // this.timelineRowChanged.emit(row);
  }

}
