import * as fromPaper from './paper.actions';
import { BBAnimation, BBShape } from '../animations/animation.service';

export interface PaperState {
  animation: BBAnimation;
  newShape: BBShape;
  updatedShape: BBShape;
}

export const initialPaperState: PaperState = {
  animation: undefined,
  newShape: undefined,
  updatedShape: undefined
};


export function paperReducer(state = initialPaperState, action: fromPaper.PaperActions): PaperState {
  switch (action.type) {
    case fromPaper.SHAPE_CREATED: {
      return {
        ...state,
        newShape: action.shape
      };
    }
    case fromPaper.SHAPE_UPDATED: {
      return {
        ...state,
        updatedShape: action.shape
      };
    }
    case fromPaper.ANIMATION_LOADED: {
      return {
        ...state,
        animation: action.animation
      };
    }
  }
  return state;
}
