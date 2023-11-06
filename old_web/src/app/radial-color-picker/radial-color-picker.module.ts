import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadialColorPickerComponent } from './radial-color-picker/radial-color-picker.component';
import { MatTooltipModule } from '@angular/material';
import { RadialColorGradientDirective } from './radial-color-gradient.directive';
import { RadialColorRotatorDirective } from './radial-color-rotator.directive';

@NgModule({
  declarations: [
    RadialColorPickerComponent,
    RadialColorGradientDirective,
    RadialColorRotatorDirective,
  ],
  imports: [
    CommonModule,
    MatTooltipModule
  ],
  exports: [
    RadialColorPickerComponent
  ]
})
export class RadialColorPickerModule { }
