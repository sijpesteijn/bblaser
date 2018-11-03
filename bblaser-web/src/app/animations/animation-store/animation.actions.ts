import { Action } from '@ngrx/store';
import { BBAnimation, BBShape } from '../animation.service';

export const SELECT_ANIMATION = '[Animation] SelectAnimationAction';
export const SELECT_ANIMATION_SUCCESS = '[Animation] SelectAnimationActionSuccess';
export const SELECT_ANIMATION_FAIL = '[Animation] SelectAnimationActionFail';
export const LOAD_ANIMATION = '[Animation] LoadAnimationAction';
export const SAVE_ANIMATION = '[Animation] SaveAnimationAction';
export const SAVE_ANIMATION_SUCCESS = '[Animation] SaveAnimationSuccessAction';
export const SAVE_ANIMATION_FAIL = '[Animation] SaveAnimationFailAction';
export const SET_TIMER_POSITION = '[Animation] SetTimerPosition';
export const PREVIEW_ANIMATION = '[Animation] PreviewAnimation';
export const SELECT_DRAW_TOOL = '[Paper] SelectDrawToolAction';
export const SEND_TO_LASER = '[Animation] SendToLaser';

export class SelectDrawToolAction implements Action {
  readonly type = SELECT_DRAW_TOOL;
  constructor(public tool: string) {}
}

export class SelectAnimationAction implements Action {
  readonly type = SELECT_ANIMATION;
  constructor(public animation: BBAnimation) {}
}

export class LoadAnimationSuccessAction implements Action {
  readonly type = SELECT_ANIMATION_SUCCESS;
  constructor(public animation: BBAnimation) {}
}

export class LoadAnimationFailAction implements Action {
  readonly type = SELECT_ANIMATION_FAIL;
  constructor(public payload: any) {}
}

export class LoadAnimationAction implements Action {
  readonly type = LOAD_ANIMATION;
  constructor(public animationId: string) {}
}

export class SaveAnimationAction implements Action {
  readonly type = SAVE_ANIMATION;
  constructor(public animation: BBAnimation, public open: boolean) {}
}

export class SaveAnimationSuccessAction implements Action {
  readonly type = SAVE_ANIMATION_SUCCESS;
  constructor(public animation: BBAnimation) {}
}

export class SaveAnimationFailAction implements Action {
  readonly type = SAVE_ANIMATION_FAIL;
  constructor(public payload: any) {}
}

export class SetTimerPosition implements Action {
  readonly type = SET_TIMER_POSITION;
  constructor(public timerPosition: number) {}
}

export class PreviewAnimation implements Action {
  readonly type = PREVIEW_ANIMATION;
  constructor(public animation: BBAnimation) {}
}

export class SendToLaser implements Action {
  readonly type = SEND_TO_LASER;
  constructor(public bbShapes: BBShape[]) {}
}


export type AnimationActions = SelectAnimationAction | LoadAnimationSuccessAction | LoadAnimationFailAction |
  LoadAnimationAction | SaveAnimationAction | SaveAnimationSuccessAction | SaveAnimationFailAction | SetTimerPosition |
  PreviewAnimation | SelectDrawToolAction | SendToLaser;
