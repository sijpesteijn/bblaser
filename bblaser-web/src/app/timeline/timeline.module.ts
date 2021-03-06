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
import { ColorGradientEffectComponent } from '../timeline-effects/color-gradient-effect.component';
import { ShapeMoveEffectComponent } from '../timeline-effects/shape-move-effect.component';
import { ShapeRotateEffectComponent } from '../timeline-effects/shape-rotate-effect.component';
import { ShapeResizeEffectComponent } from '../timeline-effects/shape-resize-effect.component';
import {
  TimelineRowObjectContextMenuComponent
} from './timeline-row-object/timeline-row-object-contextmenu/timeline-row-object-context-menu.component';
import { ResizableModule } from 'angular-resizable-element';
import { DndModule } from 'ngx-drag-drop';
import { EffectDirective } from './timeline-row-object/timeline-row-effects/effect.directive';
import { TimelineRowEffectComponent } from './timeline-row-object/timeline-row-effects/timeline-row-effect.component';
import { RadialColorPickerModule } from '../radial-color-picker/radial-color-picker.module';
import { TimelineRowMaxEffectsPipe } from './timeline-row-object/timeline-row-max-effects.pipe';
import { TimelineRowEffectContextmenuComponent } from './timeline-row-object/timeline-row-effects/timeline-row-effect-contextmenu/timeline-row-effect-contextmenu.component';


const TIMESCALES: TimeScale[] = [
  {
    name: 'seconds',
    postfix: 's',
    scale: 1,
    pixelsPerMillisecond: 1000 / LABEL_WIDTH
  },
  {
    name: 'tenseconds',
    postfix: '0s',
    scale: 10,
    pixelsPerMillisecond: 1000 / LABEL_WIDTH
  },
  {
    name: 'minutes',
    postfix: 'min',
    scale: 60,
    pixelsPerMillisecond: 1000 / LABEL_WIDTH
  }
];

@NgModule({
  imports: [
    CommonModule,
    RadialColorPickerModule,
    MaterialModule,
    ResizableModule,
    DndModule
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
    TimelineRowDeleteDialogComponent,
    EffectDirective,
    TimelineRowEffectComponent,
    TimelineRowMaxEffectsPipe,
    TimelineRowEffectContextmenuComponent
  ],
  exports: [
    TimelineComponent
  ],
  entryComponents: [
    TimelineRowDeleteDialogComponent,
    ColorGradientEffectComponent,
    ShapeRotateEffectComponent,
    ShapeMoveEffectComponent,
    ShapeResizeEffectComponent
  ],
  providers: [
    {provide: 'timeScales', useValue: TIMESCALES}
  ]
})
export class TimelineModule {}
