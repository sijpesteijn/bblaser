import { BBEffect } from '../../animations/animation.service';
import * as fromTimeline from './timeline.actions';
import * as fromAnimation from '../../animations/animation-store/animation.actions';
import { selected } from './timeline.selectors';

export interface TimelineObject {
  id: number;
  start: number;
  duration: number;
  selected: boolean;
  effects: BBEffect[];
}

export interface TimelineRow {
  id: number;
  name: string;
  selected: boolean;
  expanded: boolean;
  timelineObjects: TimelineObject[];
}

export interface TimelineState {
  rows: TimelineRow[];
  selected: TimelineObject[];
  indicatorPosition: number;
}

export const initialTimelineState: TimelineState = {
  rows: undefined,
  selected: [],
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
      state.selected = action.highligthed;
      return {
        ...state
      };
    }
    case fromTimeline.TIMELINE_ADD_TO_SELECTED: {
      console.log('Adding ', action.timelineObject);
      return {
        ...state,
        selected: [
          ...state.selected,
          action.timelineObject
        ]
      };
    }
    case fromTimeline.TIMELINE_DELETE_FROM_SELECTED: {
      console.log('Deleting ', action.timelineObject);
      return {
        ...state,
        selected: [
          ...state.selected.filter(ro => ro.id !== action.timelineObject.id)
        ]
      };
    }
    case fromTimeline.TIMELINE_SET_SELECTED: {
      console.log('Set selected ', action.timelineObjects);
      return {
        ...state,
        selected: action.timelineObjects
      };
    }
    case fromTimeline.TIMELINE_CONTAINER_CLICK: {
      console.log('Container click');
      return {
        ...state,
        selected: []
      };
    }
  }
  return state;
}
