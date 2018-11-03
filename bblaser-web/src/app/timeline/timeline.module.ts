import { NgModule } from '@angular/core';
import { TimelineRowObjectComponent } from './timeline-row-object/timeline-row-object.component';
import { TimelineComponent } from './timeline.component';
import { TimelineRowComponent } from './timeline-row/timeline-row.component';
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
import { TimelineRowObjectContextmenuComponent } from './timeline-row-object/timeline-row-object-contextmenu/timeline-row-object-contextmenu.component';

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
    TimelineRowObjectContextmenuComponent
  ],
  exports: [
    TimelineComponent
  ]
})
export class TimelineModule {}
