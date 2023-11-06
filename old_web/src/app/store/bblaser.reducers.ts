import * as fromBBLaser from './bblaser.action';
import * as fromAnimations from '../animations/animation-store/';
import * as fromAnimation from '../animations/animation-store/';
import * as fromPaper from '../paper';
import * as fromLaser from '../laser';
import * as fromTimeline from '../timeline/store/';
import { AnimationsState, initialAnimationsState } from '../animations/animation-store/animations.reducers';
import { ActionReducerMap } from '@ngrx/store';
import { AnimationState, initialAnimationState } from '../animations/animation-store/animation.reducers';
import { initialPaperState, PaperState } from '../paper/paper.reducers';
import { initialTimelineState, TimelineState } from '../timeline/store/timeline.reducers';
import { initialLaserState, LaserState } from '../laser';

export interface BBState {
  animations: AnimationsState;
  animation: AnimationState;
  timeline: TimelineState;
  paper: PaperState;
  laser: LaserState;
}

export const initialBBState: BBState = {
  animations: initialAnimationsState,
  animation: initialAnimationState,
  timeline: initialTimelineState,
  paper: initialPaperState,
  laser: initialLaserState
};


export const reducers: ActionReducerMap<BBState> = {
  animations: fromAnimations.animationsReducer,
  animation: fromAnimation.animationReducer,
  timeline: fromTimeline.timelineReducer,
  paper: fromPaper.paperReducer,
  laser: fromLaser.laserReducer
};

