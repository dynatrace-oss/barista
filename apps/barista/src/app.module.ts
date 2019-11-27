/**
 * @license
 * Copyright 2019 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// tslint:disable: no-duplicate-imports max-file-line-count

import {
  CommonModule,
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BaApp } from './app';
import { BaContributors } from './layout/contributors/contributors';
import { BaFooter } from './layout/footer/footer';
import { BaIconColorWheel } from './components/icon-color-wheel/icon-color-wheel';
import { BaIndexPage } from './pages/index-page/index-page';
import { BaLocationService } from './shared/location.service';
import { BaNav } from './layout/nav/nav';
import { BaOverviewPage } from './pages/overview-page/overview-page';
import { BaPageContent } from './pages/page-content';
import { BaPageFooter } from './layout/page-footer/page-footer';
import { BaPageHeader } from './layout/page-header/page-header';
import { BaPageOutlet } from './pages/page-outlet';
import { BaPageService } from './shared/page.service';
import { BaRecentlyOrderedService } from './shared/recently-ordered.service';
import { BaScrollSpyService } from './shared/scroll-spy.service';
import { BaSearch } from './layout/search/search';
import { BaSidenav } from './layout/sidenav/sidenav';
import { BaSinglePage } from './pages/single-page/single-page';
import { BaIconPage } from './pages/icon-page/icon-page';
import { BaSmallTile } from './layout/smalltile/smalltile';
import { BaTile } from './layout/tile/tile';
import { BaToc } from './layout/toc/toc';
import { BaTocService } from './shared/toc.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtOverlayModule } from '@dynatrace/barista-components/overlay';
import { DtSwitchModule } from '@dynatrace/barista-components/switch';
import { DtTagModule } from '@dynatrace/barista-components/tag';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { environment } from './environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DtTagModule,
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
    BaSinglePage,
    BaIconPage,
    BaIconColorWheel,
    BaOverviewPage,
    BaTile,
    BaIndexPage,
    BaSmallTile,
    BaSearch,
    BaToc,
    BaSidenav,
  ],
  providers: [
    BaPageService,
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    BaLocationService,
    BaTocService,
    BaScrollSpyService,
    BaRecentlyOrderedService,
  ],
  entryComponents: [
    BaSinglePage,
    BaIconPage,
    BaPageHeader,
    BaContributors,
    BaPageFooter,
    BaOverviewPage,
    BaIndexPage,
    BaSmallTile,
    BaSearch,
    BaSidenav,
  ],
  bootstrap: [BaApp],
})
export class AppModule {}
