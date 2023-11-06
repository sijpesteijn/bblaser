import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BBPoint } from '../../../animations/animation.service';
import { EffectInfo, EffectService } from '../../../timeline-effects/effect.service';

@Component({
  selector: 'bb-timeline-row-object-context-menu',
  template: `
    <div class="context-menu" [ngStyle]="{'left.px': point.x, 'top.px': point.y}">
      <mat-card>
        <ul>
          <li *ngFor="let effect of effects"><button mat-button (click)="addEffect($event, effect.type)">{{effect.name}}</button></li>
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
export class TimelineRowObjectContextMenuComponent implements OnInit {
  @Input()
  point: BBPoint;
  effects: EffectInfo[];

  @Output()
  typeChanged: EventEmitter<string> = new EventEmitter();

  constructor(private effectService: EffectService) {}

  ngOnInit(): void {
    this.effects = this.effectService.getEffectsInfo();
  }

  addEffect(event: MouseEvent, type: string) {
    this.typeChanged.emit(type);
    event.stopPropagation();
  }

}
