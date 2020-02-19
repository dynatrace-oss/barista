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

import {
  BaIconOverviewPageContent,
  BaIndexPageContent,
  BaSinglePageContent,
  BaCTA,
  BaPageTeaser,
  BaPageLink,
  BaContributor,
} from '@dynatrace/barista-definitions';

/** Page builder types */
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
export enum BaStrapiContentType {
  Pages = 'pages',
  Snippets = 'snippets',
  Pageteasers = 'pageteasers',
  CTAs = 'ctas',
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
}
