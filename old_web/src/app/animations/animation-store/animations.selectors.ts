import { createSelector } from '@ngrx/store';
import { AnimationsState } from './animations.reducers';
import { bblaserState } from '../../store/bblaser.selectors';
import { BBState } from '../../store/bblaser.reducers';


export const animationsState = createSelector(bblaserState, (state: BBState) => state.animations);
export const selectAllAnimations = createSelector(animationsState, (state: AnimationsState) => state.animationPagedCollection);
