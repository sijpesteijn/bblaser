import * as fromAnimation from './animation.actions';
import { BBAnimation } from '../animation.service';

export interface AnimationState {
  animation?: BBAnimation;
  timePosition: number;
  previewAnimation?: BBAnimation;
  loading: boolean;
  loaded: boolean;
  tool: string;
}

export const initialAnimationState: AnimationState = {
  timePosition: 0,
  loading: false,
  loaded: false,
  tool: undefined
};

export function animationReducer(state = initialAnimationState, action: fromAnimation.AnimationActions): AnimationState {
  switch (action.type) {
    case fromAnimation.ANIMATION_UPDATED: {
      return {
        ...state,
        animation: {
          ...action.animation
        }
      };
    }
    case fromAnimation.SELECT_DRAW_TOOL: {
      return {
        ...state,
        tool : action.tool
      };
    }
    case fromAnimation.SELECT_ANIMATION: {
      state.animation = action.animation;
      return {
        ...state,
        loading: true,
      };
    }
    case fromAnimation.SELECT_ANIMATION_SUCCESS: {
      return {
        ...state,
        animation: action.animation,
        loading: false,
        loaded: true
      };
    }
    case fromAnimation.SELECT_ANIMATION_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }
    case fromAnimation.SET_TIMER_POSITION: {
      return {
        ...state,
        timePosition: action.timerPosition
      };
    }
    case fromAnimation.PREVIEW_ANIMATION: {
      return {
        ...state,
        previewAnimation: action.animation
      };
    }
  }
  return state;
}
