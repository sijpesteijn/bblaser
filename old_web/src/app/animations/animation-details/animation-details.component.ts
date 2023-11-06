import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BBAnimation } from '../animation.service';

@Component({
  selector: 'bb-animation-details',
  template: `    
    <mat-card>
      <mat-card-title [innerHTML]="animation?.title"></mat-card-title>
      <mat-list dense>
        <mat-list-item>
          <caption>Title</caption>
          <span>{{animation?.title}}</span>
        </mat-list-item>
        <mat-list-item>
          <caption>Nr of elements</caption>
          <span>{{animation?.elements.length}}</span>
        </mat-list-item>
      </mat-list>
    </mat-card>
  `,
  styles: [`
    caption { min-width: 100px; text-align: left; align-self: start; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimationDetailsComponent {
  @Input()
  animation!: BBAnimation;

}
