import { Action } from '@ngrx/store';
import { BBAnimation, BBShape } from '../animations/animation.service';

export const SHAPE_CREATED = '[Paper] ShapeCreatedAction';
export const SHAPE_UPDATED = '[Paper] ShapeUpdatedAction';
export const ANIMATION_LOADED = '[Paper] AnimationLoadedAction';

export class ShapeCreatedAction {
  readonly type = SHAPE_CREATED;
  constructor(public shape: BBShape) {}
}

export class ShapeUpdatedAction {
  readonly type = SHAPE_UPDATED;
  constructor(public shape: BBShape) {}
}

export class AnimationLoadedAction {
  readonly type = ANIMATION_LOADED;
  constructor(public animation: BBAnimation) {}
}

export type PaperActions = ShapeCreatedAction | ShapeUpdatedAction | AnimationLoadedAction;
