import { TimelineObject, TimelineRow } from './timeline.reducers';

export const TIMELINE_LOAD_ROWS = '[Timeline] loadRows';
export const TIMELINE_HIGHLIGHT = '[Timeline] previewAnimation';
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

export type TimelineActions = TimelineLoadRowsAction | TimelineHighlightAction;
