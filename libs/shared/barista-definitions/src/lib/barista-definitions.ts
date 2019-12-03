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

export type BaPageTransformer = (
  source: BaSinglePageContent,
) => Promise<BaSinglePageContent>;

// tslint:disable-next-line: no-any
export type BaPageBuilder = (...args: any[]) => Promise<BaPageBuildResult[]>;

export type BaPageBuilderContentResult =
  | BaSinglePageContent
  | BaIndexPageContent;

export interface BaPageBuildResult {
  relativeOutFile: string;
  pageContent: BaPageBuilderContentResult;
}

export const enum BaLayoutType {
  Default = 'default',
  Overview = 'overview',
  Icon = 'icon',
  Index = 'index',
}

export interface BaPageMetaBase {
  title: string;
  layout: BaLayoutType;
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
  identifier?: string;
  order?: number;
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
  layout: 'index';
  mostordered: BaStrapiPageLink[];
  gettingstarted: BaStrapiPageTeaser[];
  cta: BaStrapiCTA;
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
  content: string;
  uxWikiPage: string;
  tags: BaStrapiNamedEntity[];
  contributors: BaStrapiContributor[];
  category: BaStrapiCategory;
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
}

/** Strapi CTA */
export interface BaStrapiCTA extends BaStrapiBase {
  title: string;
  text: string;
  buttontext: string;
  buttonlink: string;
}

export interface BaOverviewPageContents extends BaPageMetaBase {
  sections: BaOverviewPageSection[];
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

export interface BaOverviewPageSectionItem {
  identifier: string;
  title: string;
  section: string;
  badge: string[];
  link: string;
  description: string;
  order?: number;
}
