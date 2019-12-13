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

export type BaPageTransformer = (
  source: BaSinglePageContent,
) => Promise<BaSinglePageContent>;

// tslint:disable-next-line: no-any
export type BaPageBuilder = (
  globalTransformers: BaPageTransformer[],
  ...args: any[]
) => Promise<BaPageBuildResult[]>;

export type BaPageBuilderContentResult =
  | BaSinglePageContent
  | BaIndexPageContent
  | BaIconOverviewPageContent;

export interface BaPageBuildResult {
  relativeOutFile: string;
  pageContent: BaPageBuilderContentResult;
}

export const enum BaLayoutType {
  Default = 'default',
  Overview = 'overview',
  IconOverview = 'iconOverview',
  Icon = 'icon',
  Index = 'index',
  Error = 'error',
}

export interface BaPageMetaBase {
  title: string;
  layout: BaLayoutType;
  description?: string;
  public?: boolean;
  draft?: boolean;
  navGroup?: string;
}

export interface BaErrorPageContent extends BaPageMetaBase {
  layout: BaLayoutType.Error;
  content: string;
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
}

export interface BaSinglePageContent extends BaSinglePageMeta {
  content: string;
}

export interface BaContributors {
  dev?: BaContributor[];
  ux?: BaContributor[];
}

export interface BaContributor {
  name: string;
  gitHubUser: string;
}

/** Index page content */
export interface BaIndexPageContent {
  title: string;
  subtitle: string;
  layout: BaLayoutType.Index;
  mostordered: BaStrapiPageLink[];
  gettingstarted: BaStrapiPageTeaser[];
  cta: BaStrapiCTA;
}

/** Icon overview page */
export interface BaIconOverviewPageContent {
  title: string;
  description?: string;
  layout: BaLayoutType;
  icons: BaIconOverviewItem[];
  sidenav?: BaCategoryNavigation;
  category?: string;
}

/** Icon overview page item */
export interface BaIconOverviewItem {
  title: string;
  name: string;
  tags: string[];
}

/** Base interface for Strapi content types */
export interface BaStrapiBase {
  id: number;
  created_at: number;
  updated_at: number;
}

/** Strapi content type with a name */
export interface BaStrapiNamedEntity extends BaStrapiBase {
  name: string;
}

/** Strapi page category */
export interface BaStrapiCategory extends BaStrapiBase {
  title: string;
}

/** Strapi contributor (UX/Dev support) */
export interface BaStrapiContributor extends BaStrapiNamedEntity {
  githubuser: string;
  developer: boolean;
}

/** Strapi page */
export interface BaStrapiPage extends BaStrapiBase {
  title: string;
  slug: string;
  public: boolean;
  description: string;
  content: string;
  wiki: string;
  tags: BaStrapiNamedEntity[];
  contributors: BaStrapiContributor[];
  category: BaStrapiCategory;
  draft: boolean;
  toc: boolean;
}

/** Strapi snippet */
export interface BaStrapiSnippet extends BaStrapiBase {
  slotID: string;
  title: string;
  content: string;
}

/** Strapi content types */
export enum BaStrapiContentType {
  Pages = 'pages',
  Snippets = 'snippets',
  Pageteasers = 'pageteasers',
  CTAs = 'ctas',
}

/** Strapi page-link (tile) */
export interface BaStrapiPageLink {
  title: string;
  link: string;
  category: string;
}

/** Strapi page-teaser */
export interface BaStrapiPageTeaser extends BaStrapiBase {
  title: string;
  text: string;
  link: string;
  borderColor: string;
  page: BaStrapiPage;
}

/** Strapi CTA */
export interface BaStrapiCTA extends BaStrapiBase {
  title: string;
  text: string;
  buttontext: string;
  buttonlink: string;
}

export interface BaCategoryNavigationContents extends BaPageMetaBase {
  sections: BaCategoryNavigationSection[];
}

export interface BaCategoryNavigationSection {
  title?: string;
  items: BaCategoryNavigationSectionItem[];
}

export interface BaCategoryNavigation {
  title: string;
  id: string;
  layout: BaLayoutType;
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
}

export interface BaNav {
  navItems: BaNavItem[];
}

export interface BaNavItem {
  label: string;
  url: string;
  order?: number;
}
