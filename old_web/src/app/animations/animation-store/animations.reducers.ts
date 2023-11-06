import * as fromAnimations from './animations.actions';
import { AnimationPagedCollection, BBAnimation } from '../animation.service';

export interface AnimationsState {
  animationPagedCollection: AnimationPagedCollection;
  loading: boolean;
  loaded: boolean;
}

export const initialAnimationsState: AnimationsState = {
  animationPagedCollection: undefined,
  loading: false,
  loaded: false
};

export function animationsReducer(state = initialAnimationsState, action: fromAnimations.AnimationsActions): AnimationsState {
  switch (action.type) {
    case fromAnimations.LOAD_ANIMATIONS: {
      return {
        ...state,
        loading: true
      };
    }
    case fromAnimations.LOAD_ANIMATIONS_SUCCESS: {
      return {
        ...state,
        animationPagedCollection: action.payload,
        loading: false,
        loaded: true,
      };
    }
    case fromAnimations.LOAD_ANIMATIONS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
      };
    }
    case fromAnimations.REMOVE_ANIMATION_SUCCESS: {
      console.log('Deleting');
      return {
        ...state,
        animationPagedCollection: state.animationPagedCollection
      };
    }
  }
  return state;
}
