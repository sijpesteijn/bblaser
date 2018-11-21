import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as animationStore from '../animation-store';
import { Store } from '@ngrx/store';
import { MatButtonToggleChange, MatButtonToggleGroup } from '@angular/material';
import { DEFAULT_TOOL } from '../../paper/tools';

@Component({
  selector: 'bb-animation-draw-tools',
  template: `
    <div class="animation_draw_tools">
      <mat-button-toggle-group (change)="selectTool($event)" #drawToolGroup [value]="activeTool">
        <mat-button-toggle value="selectTool">
          <mat-icon>edit</mat-icon>
        </mat-button-toggle>
        <mat-button-toggle value="boxTool">
          <mat-icon>border_style</mat-icon>
        </mat-button-toggle>
        <mat-button-toggle value="lineTool">
          <mat-icon>timeline</mat-icon>
        </mat-button-toggle>
        <mat-button-toggle value="moveTool">
          <mat-icon>open_with</mat-icon>
        </mat-button-toggle>
      </mat-button-toggle-group>
    </div>`,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimationDrawToolsComponent implements OnChanges, OnDestroy {
  @ViewChild('drawToolGroup') drawToolGroup: MatButtonToggleGroup;
  activeTool = DEFAULT_TOOL;

  constructor(private aStore: Store<animationStore.AnimationState>) { }

  ngOnChanges(changes: SimpleChanges) {

  }

  ngOnDestroy() {
    this.aStore.dispatch(new animationStore.SelectDrawToolAction(undefined));
  }

  selectTool(event: MatButtonToggleChange) {
    this.aStore.dispatch(new animationStore.SelectDrawToolAction(event.value));
  }
}
