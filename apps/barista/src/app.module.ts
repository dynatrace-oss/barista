/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
import { BaCopyToClipboardService } from './shared/copy-to-clipboard.service';
import { BaScrollToTop } from './layout/scroll-to-top/scroll-to-top';
import { BaSearch } from './layout/search/search';
import { BaSidenav } from './layout/sidenav/sidenav';
import { BaSinglePage } from './pages/single-page/single-page';
import { BaIconOverviewPage } from './pages/icon-overview-page/icon-overview-page';
import { BaSmallTile } from './layout/smalltile/smalltile';
import { BaTile } from './layout/tile/tile';
import { BaToc } from './layout/toc/toc';
import { BaTocService } from './shared/toc.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtTagModule } from '@dynatrace/barista-components/tag';
import { DtFormFieldModule } from '@dynatrace/barista-components/form-field';
import { DtInputModule } from '@dynatrace/barista-components/input';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { environment } from './environments/environment';
import { BaComponentsModule } from './components';
import { DtBreadcrumbsModule } from '@dynatrace/barista-components/breadcrumbs';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import { DtExamplesModule } from '@dynatrace/barista-components/examples';
import { DtToastModule } from '@dynatrace/barista-components/toast';
import { RouterModule } from '@angular/router';

/**
 * Function expressions are not supported in decorators,
 * so this dummy error handler has to be an exported function.
 */
export function BaDummyErrorHandler(): void {}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DtTagModule,
    DtBreadcrumbsModule,
    DtIconModule.forRoot({
      svgIconLocation: `${environment.deployUrl}assets/icons/{{name}}.svg`,
    }),
    BaComponentsModule,
    DtFormFieldModule,
    DtInputModule,
    DtThemingModule,
    DtExamplesModule,
    DtToastModule,
    /**
     * The routermodule is added for the secondary-nav component examples
     * to work. This can be removed as soon as the secondary-nav-section
     * does not depend on it anymore. (see issue #465 on github)
     */
    RouterModule.forRoot([], { errorHandler: BaDummyErrorHandler }),
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
    BaOverviewPage,
    BaIconOverviewPage,
    BaTile,
    BaIndexPage,
    BaSmallTile,
    BaSearch,
    BaToc,
    BaSidenav,
    BaScrollToTop,
  ],
  providers: [
    BaPageService,
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    BaLocationService,
    BaTocService,
    BaScrollSpyService,
    BaRecentlyOrderedService,
    BaCopyToClipboardService,
  ],
  entryComponents: [
    BaSinglePage,
    BaIconOverviewPage,
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
