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

const routes = [
  { path: '', redirectTo: '/animations', pathMatch: 'full' },
  { path: 'animations', loadChildren: './animations/animations.module#AnimationsModule'},
  { path: 'sequences', loadChildren: './sequences/sequences.module#SequencesModule'}
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
    // FlexLayoutModule,
    EditValueModule,
    MaterialModule,
    HttpClientModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreModule.forFeature('bblaser', reducers),
    RouterModule.forRoot(routes),
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
