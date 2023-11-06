import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: '/animations', pathMatch: 'full' },
  { path: 'animations', loadChildren: () => import('./animations/animations.module').then(m => m.AnimationsModule)},
  { path: 'sequences', loadChildren: () => import('./sequences/sequences.module').then(m => m.SequencesModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
