import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './store/bblaser.reducers';
import { EditValueModule } from './edit-value/edit-value.module';
import { PaperService } from './paper/paper.service';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { StoreDevtools, StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { ResizableModule } from 'angular-resizable-element';
import { DndModule } from 'ngx-drag-drop';
import { RadialColorPickerModule } from './radial-color-picker/radial-color-picker.module';
import { LaserEffects } from './laser';

const routes = [
  { path: '', redirectTo: '/animations', pathMatch: 'full' },
  { path: 'animations', loadChildren: () => import('./animations/animations.module').then(m => m.AnimationsModule)},
  { path: 'sequences', loadChildren: () => import('./sequences/sequences.module').then(m => m.SequencesModule)}
];

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SettingsDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DndModule,
    RadialColorPickerModule,
    // FlexLayoutModule,
    EditValueModule,
    MaterialModule,
    HttpClientModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([LaserEffects]),
    StoreModule.forFeature('bblaser', reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    PaperService
  ],
  entryComponents: [
    SettingsDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
