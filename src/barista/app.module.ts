// tslint:disable: no-duplicate-imports max-file-line-count

import {
  CommonModule,
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BaContributors } from 'layout/contributors/contributors';

import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtOverlayModule } from '@dynatrace/angular-components/overlay';
import { DtSwitchModule } from '@dynatrace/angular-components/switch';

import { BaApp } from './app';
import { BaIconColorWheel } from './components/icon-color-wheel/icon-color-wheel';
import { environment } from './environments/environment';
import { BaFooter } from './layout/footer/footer';
import { BaNav } from './layout/nav/nav';
import { BaPageFooter } from './layout/page-footer/page-footer';
import { BaPageHeader } from './layout/page-header/page-header';
import { BaComponentPage } from './pages/component-page/component-page';
import { BaPageContent } from './pages/page-content';
import { BaPageOutlet } from './pages/page-outlet';
import { BaSimplePage } from './pages/simple-page/simple-page';
import { BaLocationService } from './shared/location.service';
import { BaPageService } from './shared/page.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DtIconModule.forRoot({
      svgIconLocation: `${environment.deployUrl.replace(
        /\/+$/,
        '',
      )}/assets/icons/{{name}}.svg`,
    }),
    DtSwitchModule,
    DtOverlayModule,
  ],
  exports: [],
  declarations: [
    BaApp,
    BaNav,
    BaFooter,
    BaPageContent,
    BaPageHeader,
    BaPageFooter,
    BaContributors,
    BaPageOutlet,
    BaComponentPage,
    BaSimplePage,
    BaIconColorWheel,
  ],
  providers: [
    BaPageService,
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    BaLocationService,
  ],
  entryComponents: [
    BaComponentPage,
    BaSimplePage,
    BaPageHeader,
    BaContributors,
    BaPageFooter,
  ],
  bootstrap: [BaApp],
})
export class AppModule {}
