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

import {
  BaIconOverviewPageContent,
  BaIndexPageContent,
  BaSinglePageContent,
  BaCTA,
  BaPageTeaser,
  BaPageLink,
  BaContributor,
} from '@dynatrace/shared/design-system/interfaces';

/** Page builder types */
export type BaPageTransformer = (
  source: BaSinglePageContent,
) => Promise<BaSinglePageContent>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

/** Icon pages */
export interface BaIconsChangelogItem {
  mode: string;
  file: string;
  name: string;
}

export interface BaIconsChangelog {
  [key: string]: BaIconsChangelogItem[];
}

/** Strapi content */
// eslint-disable-next-line no-shadow
export enum BaStrapiContentType {
  Pages = 'pages',
  Snippets = 'snippets',
  Pageteasers = 'pageteasers',
  CTAs = 'ctas',
  UXDNodes = 'decisiongraphs',
  Categories = 'categories',
}

/** Base interface for Strapi content types */
export interface BaStrapiBase {
  id: number;
  created_at: number;
  updated_at: number;
}

/** Strapi contributor (UX/Dev support) */
export interface BaStrapiContributor extends BaStrapiBase, BaContributor {
  developer: boolean;
}

/** Strapi category */
export interface BaStrapiCategory extends BaStrapiBase {
  title: string;
  pages: string[];
  nextpages: string[];
}

/** Strapi tag */
export interface BaStrapiTag extends BaStrapiBase {
  name: string;
}

/** Strapi page-link (tile) */
export type BaStrapiPageLink = BaStrapiBase & BaPageLink;

/** Strapi page-teaser */
export interface BaStrapiPageTeaser extends BaStrapiBase, BaPageTeaser {
  page: BaStrapiPage;
}

/** Strapi CTA */
export type BaStrapiCTA = BaStrapiBase & BaCTA;

/** Strapi snippet */
export interface BaStrapiSnippet extends BaStrapiBase {
  slotId: string;
  title: string;
  content: string;
  public: boolean | null;
}

/** Strapi page */
export interface BaStrapiPage extends BaStrapiBase {
  title: string;
  content: string;
  slug: string | null;
  public: boolean | null;
  description: string | null;
  wiki: string | null;
  tags: BaStrapiTag[];
  contributors: BaStrapiContributor[];
  category: BaStrapiCategory | null;
  draft: boolean | null;
  toc: boolean | null;
  group: string | null;
}

/** Strapi UX DecisionGraph Node */
export interface BaStrapiDecisionGraphNodeBase extends BaStrapiBase {
  title: string;
  text: string;
  start: boolean;
  tasknode: boolean;
  order: number;
}

/** Strapi UX DecisionGraph Node used for fetching from strapi */
export interface BaStrapiDecisionGraphNode
  extends BaStrapiDecisionGraphNodeBase {
  path: BaStrapiDecisionGraphEdge[];
}

/** Strapi UX DecisionGraph Edge used in BaStrapiDecisionGraphNode */
export interface BaStrapiDecisionGraphEdge {
  id: number;
  text: string;
  uxd_node: BaStrapiDecisionGraphNodeBase;
}

// eslint-disable-next-line no-shadow
export enum NextContentType {
  NextPages = 'nextpages',
}

export interface NextStrapiPage extends BaStrapiPage {
  group: string;
}

export interface DsSideNavContent {
  sections: DsSideNavSection[];
}

export interface DsSideNavSection {
  title?: string;
  items: DsSideNavSectionItem[];
}

export interface DsSideNavSectionItem {
  title: string;
  link: string;
}
