import { Pipe, PipeTransform } from '@angular/core';
import { TimelineRow } from '../store';

export const TIMELINE_ROW_HEADER_HEIGHT = 20

@Pipe({
  name: 'timelineRowMaxEffects',
  pure: false
})
export class TimelineRowMaxEffectsPipe implements PipeTransform {

  transform(row: TimelineRow, args?: any): number {
    if (!row.expanded) {
      return TIMELINE_ROW_HEADER_HEIGHT;
    }
    let timelineObjectsSorted = row.timelineObjects.sort((tlo1, tlo2) => tlo1.effects.length - tlo2.effects.length);
    if (!timelineObjectsSorted || timelineObjectsSorted.length === 0) {
      return TIMELINE_ROW_HEADER_HEIGHT;
    }
    return (timelineObjectsSorted[0].effects.length * 24) + TIMELINE_ROW_HEADER_HEIGHT;
  }

}
