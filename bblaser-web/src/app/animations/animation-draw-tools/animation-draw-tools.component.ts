import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as paperStore from '../../paper';
import * as animationStore from '../animation-store';
import { Store } from '@ngrx/store';
import { MatButtonToggleChange, MatButtonToggleGroup } from '@angular/material';
import { DEFAULT_TOOL } from '../../paper/tools';

@Component({
  selector: 'bb-animation-draw-tools',
  templateUrl: './animation-draw-tools.component.html',
  styleUrls: ['./animation-draw-tools.component.scss']
})
export class AnimationDrawToolsComponent implements OnInit, OnDestroy {
  @ViewChild('drawToolGroup') drawToolGroup: MatButtonToggleGroup;
  activeTool = DEFAULT_TOOL;

  constructor(private aStore: Store<animationStore.AnimationState>) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.aStore.dispatch(new animationStore.SelectDrawToolAction(undefined));
  }

  selectTool(event: MatButtonToggleChange) {
    this.aStore.dispatch(new animationStore.SelectDrawToolAction(event.value));
  }
}
