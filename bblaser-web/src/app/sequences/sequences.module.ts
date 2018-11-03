import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SequenceListComponent } from './sequence-list/sequence-list.component';
import { SequenceEditComponent } from './sequence-edit/sequence-edit.component';
import { RouterModule } from '@angular/router';

const routes = [
  { path: '', component: SequenceListComponent},
  { path: ':id', component: SequenceEditComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SequenceListComponent, SequenceEditComponent]
})
export class SequencesModule { }
