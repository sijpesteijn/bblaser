import { BBEffect } from '../../animations/animation.service';
import * as fromTimeline from './timeline.actions';
import * as fromAnimation from '../../animations/animation-store/animation.actions';

export interface TimelineObject {
  id: number;
  start: number;
  duration: number;
  highlight: boolean;
  selected: boolean;
  effects: BBEffect[];
}

export interface TimelineRow {
  id: number;
  name: string;
  highlight: boolean;
  selected: boolean;
  expanded: boolean;
  timelineObjects: TimelineObject[];
}

export interface TimelineState {
  rows: TimelineRow[];
  highlighted: TimelineObject[];
  indicatorPosition: number;
}

export const initialTimelineState: TimelineState = {
  rows: undefined,
  highlighted: [],
  indicatorPosition: 0
};


export function timelineReducer(state = initialTimelineState, action: fromTimeline.TimelineActions): TimelineState {
  switch (action.type) {
    case fromTimeline.TIMELINE_LOAD_ROWS: {
      state.rows = action.rows;
      return {
        ...state
      };
    }
    case fromTimeline.TIMELINE_HIGHLIGHT: {
      state.highlighted = action.highligthed;
      return {
        ...state
      };
    }
  }
  return state;
}
