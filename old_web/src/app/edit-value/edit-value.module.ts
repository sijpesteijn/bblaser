import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { EditValueComponent } from './edit-value.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    EditValueComponent
  ],
  exports: [
    EditValueComponent
  ],
  entryComponents: [
  ]
})
export class EditValueModule { }
