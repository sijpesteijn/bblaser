
import { createSelector } from '@ngrx/store';
import { bblaserState } from '../store/bblaser.selectors';
import { BBState } from '../store/bblaser.reducers';
import { PaperState } from './paper.reducers';

export const paperState = createSelector(bblaserState, (state: BBState) => state.paper);

export const newShape = createSelector(paperState, (state: PaperState) => state.newShape);
export const updatedShape = createSelector(paperState, (state: PaperState) => state.updatedShape);
export const animationLoaded = createSelector(paperState, (state: PaperState) => state.animation);
