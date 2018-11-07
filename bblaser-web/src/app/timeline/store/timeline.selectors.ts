import { createSelector } from '@ngrx/store';
import { bblaserState } from '../../store/bblaser.selectors';
import { BBState } from '../../store/bblaser.reducers';
import { TimelineState } from './timeline.reducers';

export const timelineState = createSelector(bblaserState, (state: BBState) => {
  const timeline = state.timeline;
  return timeline;
});
export const rows = createSelector(timelineState, (state: TimelineState) => {
  return state.rows;
});
export const selected = createSelector(timelineState, (state: TimelineState) => {
  return [...state.selected];
});
export const indicatorPosition = createSelector(timelineState, (state: TimelineState) => {
  return state.indicatorPosition;
});
