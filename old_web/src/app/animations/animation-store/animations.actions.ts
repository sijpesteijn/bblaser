import { Action } from '@ngrx/store';
import { AnimationPagedCollection, BBAnimation, GetAnimationOptions } from '../animation.service';

export const LOAD_ANIMATIONS = '[Animations] LoadAnimationsAction';
export const LOAD_ANIMATIONS_SUCCESS = '[Animations] LoadAnimationsSuccessAction';
export const LOAD_ANIMATIONS_FAIL = '[Animations] LoadAnimationsFailAction';
export const REMOVE_ANIMATION = '[Animation] RemoveAnimationAction';
export const REMOVE_ANIMATION_FAIL = '[Animation] RemoveAnimationFailAction';
export const REMOVE_ANIMATION_SUCCESS = '[Animation] RemoveAnimationSuccessAction';

export class LoadAnimationsAction implements Action {
  readonly type = LOAD_ANIMATIONS;
  constructor(public options: GetAnimationOptions) {}
}

export class LoadAnimationsSuccessAction implements Action {
  readonly type = LOAD_ANIMATIONS_SUCCESS;
  constructor(public payload: AnimationPagedCollection) {}
}

export class LoadAnimationsFailAction implements Action {
  readonly type = LOAD_ANIMATIONS_FAIL;
  constructor(public payload: any) {}
}

export class RemoveAnimationAction implements Action {
  readonly type = REMOVE_ANIMATION;
  constructor(public payload: BBAnimation, public options: GetAnimationOptions) {}
}

export class RemoveAnimationFailAction implements Action {
  readonly type = REMOVE_ANIMATION_FAIL;
  constructor(public payload: any) {}
}

export class RemoveAnimationSuccessAction implements Action {
  readonly type = REMOVE_ANIMATION_SUCCESS;
  constructor(public id: number) {}
}

export type AnimationsActions = LoadAnimationsAction | LoadAnimationsSuccessAction | LoadAnimationsFailAction |
  RemoveAnimationAction | RemoveAnimationFailAction | RemoveAnimationSuccessAction;
