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
  source: BaPageContent,
) => Promise<BaPageContent>;

// tslint:disable-next-line: no-any
export type BaPageBuilder = (...args: any[]) => Promise<BaPageBuildResult[]>;

export interface BaPageBuildResult {
  relativeOutFile: string;
  pageContent: BaPageContent;
}

/** Barista contributors data */
export interface BaContributors {
  dev?: {
    name: string;
    gitHubUser: string;
  }[];
  ux?: {
    name: string;
    gitHubUser: string;
  }[];
}

/** Structure of the generated JSON page output */
export interface BaPageContent {
  title?: string;
  layout?: string;
  content?: string;
  description?: string;
  public?: boolean;
  draft?: boolean;
  contributors?: BaContributors;
  toc?: boolean;
  themable?: boolean;
  wiki?: string;
  properties?: string[];
  tags?: string[];
  related?: string[];
  nav_group?: string;
  category?: string;
}

/** Base interface for Strapi content types */
interface BaStrapiBase {
  id: number;
  created_at: number;
  updated_at: number;
}

/** Strapi content type with a name */
interface BaStrapiNamedEntity extends BaStrapiBase {
  name: string;
}

/** Strapi page category */
interface BaStrapiCategory extends BaStrapiBase {
  title: string;
}

/** Strapi contributor (UX/Dev support) */
interface BaStrapiContributor extends BaStrapiNamedEntity {
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
export enum StrapiContentType {
  Pages = 'pages',
  Snippets = 'snippets',
}
