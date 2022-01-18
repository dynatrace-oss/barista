/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  BrowserModule,
  BrowserTransferStateModule,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { DtBreadcrumbsModule } from '@dynatrace/barista-components/breadcrumbs';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtOverlayModule } from '@dynatrace/barista-components/overlay';
import { DtAutocompleteModule } from '@dynatrace/barista-components/autocomplete';
import { DtTagModule } from '@dynatrace/barista-components/tag';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import { environment } from '../environments/environment';
import { DsPageGuard, DsPageService } from '@dynatrace/shared/design-system/ui';
import { BaApp } from './app';
import { BaRoutingModule } from './app.routing.module';
import { BaFooter } from './components/footer';
import { BaNav } from './components/nav';
import { BaScrollToTop } from './components/scroll-to-top';
import { BaSearch, BaSearchResultItem } from './components/search';
import {
  BaSearchService,
  BaExternalSearchService,
} from '../shared/services/search.service';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule.withServerTransition({ appId: 'barista-design-system' }),
    BrowserTransferStateModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DtThemingModule,
    RouterModule,
    BaRoutingModule,
    DtIconModule.forRoot({
      svgIconLocation: `${environment.deployUrl}assets/icons/{{name}}.svg`,
    }),
    DtOverlayModule,
    DtTagModule,
    DtBreadcrumbsModule,
    DtAutocompleteModule,
  ],
  declarations: [
    BaApp,
    BaScrollToTop,
    BaNav,
    BaFooter,
    BaSearch,
    BaSearchResultItem,
  ],
  providers: [
    DsPageService,
    DsPageGuard,
    {
      provide: BaSearchService,
      useFactory: (http: HttpClient) => {
        if (environment.internal) {
          return new BaSearchService(http);
        } else {
          return new BaExternalSearchService();
        }
      },
      deps: [HttpClient],
    },
  ],
  bootstrap: [BaApp],
})
export class AppModule {}
