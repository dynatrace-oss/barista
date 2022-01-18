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

/** Possible layout types for pages in Barista. */
export const enum BaPageLayoutType {
  Default = 'default',
  Overview = 'overview',
  IconOverview = 'iconOverview',
  Icon = 'icon',
  Index = 'index',
  Error = 'error',
  Search = 'search',
}

/** Pages & metadata */
export interface BaPageMetaBase {
  title: string;
  layout: BaPageLayoutType;
  description?: string;
  public?: boolean;
  draft?: boolean;
  navGroup?: string;
}

export interface BaSinglePageMeta extends BaPageMetaBase {
  toc?: boolean;
  contributors?: BaContributors;
  category?: string;
  tags?: string[];
  related?: string[];
  properties?: string[];
  wiki?: string;
  themable?: boolean;
  order?: number;
  sidenav?: BaCategoryNavigation;
  imageUrl?: string;
}

export interface BaDecisionGraphPageMeta extends BaPageMetaBase {
  contributors?: BaContributors;
  category?: string;
  tags?: string[];
  decisionGraph: BaUxdNode[];
}

export interface BaSinglePageContent extends BaSinglePageMeta {
  content: string;
  tocitems?: TableOfContents[];
}

export interface BaErrorPageContent extends BaPageMetaBase {
  layout: BaPageLayoutType.Error;
  content: string;
}

export interface BaIndexPageContent extends BaPageMetaBase {
  subtitle: string;
  mostordered: BaPageLink[];
  gettingstarted: BaPageTeaser[];
  cta: BaCTA;
}

export interface BaIconOverviewPageContent extends BaPageMetaBase {
  icons: BaIcon[];
  sidenav?: BaCategoryNavigation;
  category?: string;
}

export interface BaDecisionGraphPageContent extends BaDecisionGraphPageMeta {
  content: string;
}

/** Main navigation */
export interface BaNav {
  navItems: BaNavItem[];
}

export interface BaNavItem {
  label: string;
  url: string;
  order?: number;
}

/** Category navigation (overview pages and sidenav) */
export interface BaCategoryNavigationContent extends BaPageMetaBase {
  sections: BaCategoryNavigationSection[];
}

export interface BaCategoryNavigationSection {
  title?: string;
  items: BaCategoryNavigationSectionItem[];
}

export interface BaCategoryNavigation {
  title: string;
  id: string;
  layout: BaPageLayoutType;
  description?: string;
  sections: BaCategoryNavigationSection[];
}

export interface BaCategoryNavigationSectionItem {
  identifier: string;
  title: string;
  section: string;
  badge: string[];
  link: string;
  description: string;
  order?: number;
  active?: boolean;
  imageUrl?: string;
}

/** Index page content */
export interface BaCTA {
  title: string;
  text: string;
  buttontext: string;
  buttonlink: string;
}

export interface BaPageTeaser {
  title: string;
  text: string;
  link: string;
  borderColor: string;
}

export interface BaPageLink {
  title: string;
  link: string;
  category?: string;
}

/** Page content */
export interface BaIcon {
  title: string;
  name: string;
  tags: string[];
  public: boolean;
}

export interface BaContributor {
  name: string;
  githubuser: string;
}

export interface BaContributors {
  dev?: BaContributor[];
  ux?: BaContributor[];
}

export type BaContentTypes =
  | BaSinglePageContent
  | BaErrorPageContent
  | BaIndexPageContent
  | BaIconOverviewPageContent
  | BaCategoryNavigationContent;

export interface BaUxdNode {
  id: number;
  text: string;
  start: boolean;
  tasknode: boolean;
  order: number;
  path: BaUxdEdge[];
}

export interface BaUxdEdge {
  text: string;
  uxd_node: number; // uxd_node id
  selected?: boolean;
}

export interface TableOfContents {
  id: string;
  headline: string;
  level: number;
  children: TableOfContents[];
}
