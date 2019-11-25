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

import { BaPageMetaBase } from '@dynatrace/barista-components/barista-definitions';

export interface BaIndexPageContents extends BaPageMetaBase {
  subtitle: string;
  mostordered: BaIndexPageItem[];
  gettingstarted: BaIndexPageLink[];
  cta: StrapiCTA;
}

export interface BaOverviewPageSectionItem {
  identifier: string;
  title: string;
  category: string;
  badge: string;
  link: string;
  description: string;
}

export interface BaOverviewPageSection {
  title: string;
  items: BaOverviewPageSectionItem[];
}

export interface BaIndexPageLink {
  title: string;
  text: string;
  link: string;
  borderColor: string;
}

export interface BaIndexPageItem {
  title?: string;
  identifier?: string;
  link?: string;
  category?: string;
}

export interface BaOverviewPageContents extends BaPageMetaBase {
  sections: BaOverviewPageSection[];
}

export interface StrapiCTA {
  title: string;
  text: string;
  buttontext: string;
  buttonlink: string;
}
