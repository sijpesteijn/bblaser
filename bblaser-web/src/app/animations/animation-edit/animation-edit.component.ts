import { Component, OnInit } from '@angular/core';
import { BBAnimation, BBAppearance } from '../animation.service';
import { ActivatedRoute } from '@angular/router';
import { AnimationsState } from '../animation-store';
import { Store } from '@ngrx/store';
import * as animationStore from '../animation-store';
import * as paperStore from '../../paper';
import { PaperState } from '../../paper';
import { TimelineRow } from '../../timeline/store';
import { Subject } from 'rxjs';
import { debounce, debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'bb-animation-edit',
  templateUrl: './animation-edit.component.html',
  styleUrls: ['./animation-edit.component.scss']
})
export class AnimationEditComponent implements OnInit {
  private animation: BBAnimation;
  public timelineRows: TimelineRow[] = [];
  indicatorPosition: number;

  constructor(private route: ActivatedRoute,
              private pStore: Store<PaperState>,
              private aStore: Store<AnimationsState>) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.aStore.dispatch(new animationStore.LoadAnimationAction(params.id));
    });
    this.pStore.select(paperStore.newShape).subscribe(shape => {
      if (shape !== undefined && this.animation) {
        const appearance = {
          id: shape.id,
          start: this.indicatorPosition,
          duration: 1000,
          effects: []
        };
        const element = {
          id: shape.id,
          name: shape.type === 'line' ? 'Line ' + shape.id : 'Box ' + shape.id,
          shape: shape,
          appearances: [appearance]
        };
        this.animation.elements.push(element);

        this.timelineRows.push({
          id: element.id,
          name: element.name,
          selected: false,
          expanded: false,
          timelineObjects: [{
            id: shape.id,
            start: appearance.start,
            duration: appearance.duration,
            selected: true,
            effects: appearance.effects
          }]
        });
        this.aStore.dispatch(new animationStore.SaveAnimationAction(this.animation, false));
      }
    });
    this.pStore.select(paperStore.updatedShape).subscribe(shape => {
      if (shape !== undefined && this.animation) {
        // console.log('Updated ', shape);
        this.animation.elements.find(elem => elem.id === shape.id).shape = shape;
        this.aStore.dispatch(new animationStore.SaveAnimationAction(this.animation, false));
      }
    });
    this.aStore.select(paperStore.animationLoaded).subscribe(animation => {
      if (animation) {
        // if (!this.animation) { // || this.animation.last_update !== animation.last_update) {
        //   console.log('Create timeline timelineRows ', animation);
          this.animation = animation;
          this.timelineRows = [];
          this.createTimeline();
        // }
      }
    });
  }


  private createTimeline() {
    this.animation.elements.forEach(element => {
      element.appearances.forEach(appearance => {
        this.timelineRows.push({
          id: element.id,
          name: element.name,
          selected: false,
          expanded: false,
          timelineObjects: [{
            id: appearance.id,
            start: appearance.start,
            duration: appearance.duration,
            selected: false,
            effects: appearance.effects
          }]
        });
      });
    });

  }

  handleTimelineRowChanged(row: TimelineRow) {
    const bbElement = this.animation.elements.find(element => element.id === row.id);
    bbElement.name = row.name;
    const appearances: BBAppearance[] = [];
    row.timelineObjects.forEach(timelineObject => {
      appearances.push({
        id: timelineObject.id,
        start: timelineObject.start,
        duration: timelineObject.duration,
        effects: timelineObject.effects
      });
    });
    bbElement.appearances = appearances;

    this.aStore.dispatch(new animationStore.SaveAnimationAction(this.animation, false));
  }

  setIndicatorPosition(position: number) {
    this.indicatorPosition = position;
    this.aStore.dispatch(new animationStore.SetTimerPosition(position));
  }
}
