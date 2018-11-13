import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerComponent } from './color-picker.component';
import { MatTooltipModule } from '@angular/material';

@NgModule({
  declarations: [
    ColorPickerComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule
  ],
  exports: [
    ColorPickerComponent
  ]
})
export class ColorPickerModule { }
