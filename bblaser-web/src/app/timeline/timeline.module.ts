import { NgModule } from '@angular/core';
import { TimelineRowObjectComponent } from './timeline-row-object/timeline-row-object.component';
import { LABEL_WIDTH, TimelineComponent, TimeScale } from './timeline.component';
import { TimelineRowComponent, TimelineRowDeleteDialogComponent } from './timeline-row/timeline-row.component';
import { TimelineLabelTickComponent } from './timeline-label-tick/timeline-label-tick.component';
import { TimelineMajorTickComponent } from './timeline-major-tick/timeline-major-tick.component';
import { TimelineMinorTickComponent } from './timeline-minor-tick/timeline-minor-tick.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { TimelineRowObjectEffectComponent } from './timeline-row-object-effect/timeline-row-object-effect.component';
import { ColorGradientEffectComponent } from './timeline-row-object-effect/effects/color-gradient-effect.compoent';
import { ShapeMoveEffectComponent } from './timeline-row-object-effect/effects/shape-move-effect.compoent';
import { ShapeRotateEffectComponent } from './timeline-row-object-effect/effects/shape-rotate-effect.compoent';
import { ShapeResizeEffectComponent } from './timeline-row-object-effect/effects/shape-resize-effect.compoent';
import {
  TimelineRowObjectContextMenuComponent
} from './timeline-row-object/timeline-row-object-contextmenu/timeline-row-object-context-menu.component';


const TIMESCALES: TimeScale[] = [
  {
    name: 'seconds',
    postfix: 's',
    scale: 1,
    pixelsPerTick: 1000 / LABEL_WIDTH
  },
  {
    name: 'tenseconds',
    postfix: '0s',
    scale: 10,
    pixelsPerTick: 1000 / LABEL_WIDTH
  },
  {
    name: 'minutes',
    postfix: 'min',
    scale: 60,
    pixelsPerTick: 1000 / LABEL_WIDTH
  }
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    TimelineRowObjectComponent,
    TimelineComponent,
    TimelineRowComponent,
    TimelineLabelTickComponent,
    TimelineMajorTickComponent,
    TimelineMinorTickComponent,
    TimelineRowObjectEffectComponent,
    ColorGradientEffectComponent,
    ShapeMoveEffectComponent,
    ShapeRotateEffectComponent,
    ShapeResizeEffectComponent,
    TimelineRowObjectContextMenuComponent,
    TimelineRowDeleteDialogComponent
  ],
  exports: [
    TimelineComponent
  ],
  entryComponents: [
    TimelineRowDeleteDialogComponent
  ],
  providers: [
    {provide: 'timeScales', useValue: TIMESCALES}
  ]
})
export class TimelineModule {}
