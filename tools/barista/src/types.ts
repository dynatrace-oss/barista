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

/** Contributors in page front matter */
export interface BaContributors {
  dev: string[];
  ux: string[];
}

/** Structure of the generated JSON page output */
export interface BaPageContent {
  title?: string;
  layout?: string;
  content?: string;
  description?: string;
  public?: boolean;
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
