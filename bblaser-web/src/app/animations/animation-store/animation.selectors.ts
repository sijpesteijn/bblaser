import { createSelector } from '@ngrx/store';
import { bblaserState } from '../../store/bblaser.selectors';
import { BBState } from '../../store/bblaser.reducers';
import { AnimationState } from './animation.reducers';

export const animationState = createSelector(bblaserState, (state: BBState) => state.animation);
export const selectSelectedAnimation = createSelector(animationState, (state: AnimationState) => state.animation);
export const previewAnimation = createSelector(animationState, (state: AnimationState) => state.previewAnimation);
export const selectTimerPosition = createSelector(animationState, (state: AnimationState) => state.timePosition);
export const selectedTool = createSelector(animationState, (state: AnimationState) => state.tool);

// export const selectSelectedAnimationFrame =
//   createSelector(animationState, (state: AnimationState) => state.animation ? state.animation.frames.find(frame => frame.selected) : {});
// export const selectSelectedAnimationFrameSegments =
//   createSelector(animationState, (state: AnimationState) => {
//     if (state.animation) {
//       const selectedFrame = state.animation.frames.find(frame => frame.selected);
//       if (selectedFrame) {
//         return selectedFrame.segments.filter((segment: Segment) => segment.selected);
//       }
//     }
//     return [];
//   });
// export const selectedAnimationFrame = createSelector(animationState, (state: AnimationState) => {
//   if (state.animation) {
//     const frame = state.animation.frames.find(f => f.selected);
//     return {segmentLength: frame.segments.length, frame: frame};
//   }
//   return {segmentLength: 0};
// });
