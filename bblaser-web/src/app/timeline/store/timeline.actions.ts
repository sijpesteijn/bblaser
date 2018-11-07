import { TimelineObject, TimelineRow } from './timeline.reducers';

export const TIMELINE_LOAD_ROWS = '[Timeline] loadRows';
export const TIMELINE_HIGHLIGHT = '[Timeline] previewAnimation';
export const TIMELINE_ADD_TO_SELECTED = '[Timeline] addToSelected';
export const TIMELINE_DELETE_FROM_SELECTED = '[Timeline] deleteFromSelected';
export const TIMELINE_SET_SELECTED = '[Timeline] setSelected';
export const TIMELINE_CONTAINER_CLICK = '[Timeline] containerClick';

export class TimelineLoadRowsAction {
  readonly type = TIMELINE_LOAD_ROWS;
  constructor(public rows: TimelineRow[]) {}
}

export class TimelineHighlightAction {
  constructor(public highligthed: TimelineObject[]) {
  }

  readonly type = TIMELINE_HIGHLIGHT;
}

export class TimeLineContainerClick {
  readonly type = TIMELINE_CONTAINER_CLICK;
}

export class TimelineAddToSelected {
  readonly type = TIMELINE_ADD_TO_SELECTED;
  constructor(public timelineObject: TimelineObject) {}
}

export class TimelineDeleteFromSelected {
  readonly type = TIMELINE_DELETE_FROM_SELECTED;
  constructor(public timelineObject: TimelineObject) {}
}

export class TimelineSetSelected {
  readonly type = TIMELINE_SET_SELECTED;
  constructor(public timelineObjects: TimelineObject[]) {}
}

export type TimelineActions = TimelineLoadRowsAction | TimelineHighlightAction | TimeLineContainerClick |
  TimelineAddToSelected | TimelineDeleteFromSelected | TimelineSetSelected;
