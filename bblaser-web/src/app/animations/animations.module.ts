import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { AnimationListComponent } from './animation-list/animation-list.component';
import { NgxUploaderModule } from 'ngx-uploader';
import { AnimationDeleteDialogComponent } from './animation-delete-dialog/animation-delete-dialog.component';
import { AnimationCanvasComponent } from './animation-canvas/animation-canvas.component';
import { AnimationEditComponent } from './animation-edit/animation-edit.component';
import { AnimationDrawToolsComponent } from './animation-draw-tools/animation-draw-tools.component';
import { AnimationsEffects } from './animation-store/animations.effects';
import { EffectsModule } from '@ngrx/effects';
import { AnimationEffects } from './animation-store/animation.effects';
import { EditValueModule } from '../edit-value/edit-value.module';
import { TimelineModule } from '../timeline/timeline.module';
import { AnimationCanvasSettingsComponent } from './animation-canvas/animation-canvas-settings/animation-canvas-settings.component';
import { PrefrabricatedAnimationListComponent } from './prefrabricated-animation-list/prefrabricated-animation-list.component';
import { AnimationDetailsComponent } from './animation-details/animation-details.component';
import { ResizableModule } from 'angular-resizable-element';

const routes = [
  { path: '', component: AnimationListComponent},
  { path: ':id', component: AnimationEditComponent}
];

@NgModule({
  imports: [
    CommonModule,
    EditValueModule,
    MaterialModule,
    ResizableModule,
    RouterModule.forChild(routes),
    MaterialModule,
    EffectsModule.forFeature([AnimationsEffects, AnimationEffects]),
    NgxUploaderModule,
    TimelineModule
  ],
  declarations: [
    AnimationListComponent,
    AnimationDeleteDialogComponent,
    AnimationCanvasComponent,
    AnimationEditComponent,
    AnimationDrawToolsComponent,
    AnimationCanvasSettingsComponent,
    PrefrabricatedAnimationListComponent,
    AnimationDetailsComponent,
  ],
  exports: [
    RouterModule
  ],
  entryComponents: [
    AnimationDeleteDialogComponent
  ]
})
export class AnimationsModule { }
