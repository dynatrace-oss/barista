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

export interface BaPageContents {
  title: string;
  description: string;
  id: string;
  layout: 'default' | 'overview' | 'icon' | 'index';
}

export interface BaIndexPageContents extends BaPageContents {
  subtitle: string;
  mostordered: BaIndexPageItem[];
  gettingstarted: BaIndexPageLink[];
}

export interface BaSinglePageContents extends BaPageContents {
  layout: 'default';
  toc: boolean;
  contributors?: {
    ux: string[];
    dev: string[];
  };
  category: string;
  tags: string[];
  related: string[];
  properties: string[] | null;
  wiki: string | null;
  themable: boolean | null;
  content: string;
  identifier: string;
  sidenav: BaSidenavContents;
}

export interface BaSidenavContents {
  sections: BaSidenavSection[];
}

export interface BaSidenavSection {
  title: string;
  items: BaSidenavSectionItem[];
}

export interface BaSidenavSectionItem {
  title: string;
  link: string;
}

export interface BaOverviewPageSectionItem {
  identifier: string;
  title: string;
  category: string;
  badge: string[];
  link: string;
  description: string;
}

export interface BaOverviewPageSection {
  title?: string;
  items: BaOverviewPageSectionItem[];
}

export interface BaOverviewPage {
  title: string;
  id: string;
  layout: string;
  description?: string;
  sections: BaOverviewPageSection[];
}

export interface BaIndexPageLink {
  title: string;
  text: string;
  link: string;
  bordercolor: string;
}

export interface BaIndexPageItem {
  title?: string;
  identifier?: string;
  link?: string;
  category?: string;
}

export interface BaOverviewPageContents extends BaPageContents {
  sections: BaOverviewPageSection[];
}
