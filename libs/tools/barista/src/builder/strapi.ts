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

import { join, dirname } from 'path';

import {
  BaSinglePageMeta,
  BaPageLayoutType,
} from '@dynatrace/shared/design-system/interfaces';
import { environment } from '@environments/barista-environment';
import { isPublicBuild } from '@dynatrace/shared/node';

import {
  BaPageBuilder,
  BaPageBuildResult,
  BaPageTransformer,
  BaStrapiPage,
  BaStrapiContentType,
  NextStrapiPage,
  NextContentType,
  BaStrapiCategory,
} from '../types';

import { fetchContentList } from '@dynatrace/shared/data-access-strapi';
import { slugify } from '../utils/slugify';

import {
  markdownToHtmlTransformer,
  transformPage,
  headingIdTransformer,
  copyHeadlineTransformer,
  relativeUrlTransformer,
  tableOfContentGenerator,
  headlineClassTransformer,
} from '../transform';
import { mkdirSync, writeFileSync } from 'fs';

const TRANSFORMERS: BaPageTransformer[] = [
  markdownToHtmlTransformer,
  headingIdTransformer,
  copyHeadlineTransformer,
  relativeUrlTransformer,
  tableOfContentGenerator,
  headlineClassTransformer,
];

/** Page-builder for Strapi CMS pages. */
export const strapiBuilder: BaPageBuilder = async (
  globalTransformers: BaPageTransformer[],
  next: boolean = false,
  dsEnvironment: { distDir: string },
) => {
  // Return here if no endpoint is given.
  if (!environment.strapiEndpoint) {
    return [];
  }

  let pagesData = next
    ? await fetchContentList<NextStrapiPage>(
        NextContentType.NextPages,
        { publicContent: false },
        environment.strapiEndpoint,
      )
    : await fetchContentList<BaStrapiPage>(
        BaStrapiContentType.Pages,
        { publicContent: isPublicBuild() },
        environment.strapiEndpoint,
      );

  let categoriesData: BaStrapiCategory[] = [];

  categoriesData = await fetchContentList<BaStrapiCategory>(
    BaStrapiContentType.Categories,
    // Categories have no affiliation with public / internal
    // which let's the request fail if public is built.
    { publicContent: false },
    environment.strapiEndpoint,
  );

  categoriesData = next
    ? categoriesData.filter((data) => data.nextpages.length > 0)
    : categoriesData.filter((data) => data.pages.length > 0);

  // Filter pages with draft set to null or false
  pagesData = pagesData.filter((page) => !page.draft);

  // Results from transforming the pagecontent
  const transformed: BaPageBuildResult[] = [];

  // Array of categories for corresponding design systems
  const categories: string[] = [];

  for (const page of pagesData) {
    // Check if any pages have no a category assigned. These pages would be considered main pages.
    // E.g. A page like the overview page describing the Design System itself does not relate to any category (angular-components or design-tokens for example).
    // It is considered a main (or landing page) that the user should be able to navigate to.
    if (next && page.category === null) {
      categories.push(page.title);
    }
    const pageDir = page.category ? page.category.title.toLowerCase() : '/';
    const relativeOutFile = page.slug
      ? join(pageDir, `${page.slug}.json`)
      : join(pageDir, `${slugify(page.title)}.json`);
    const pageContent = await transformPage(
      {
        ...strapiMetaData(page),
        content: page.content,
      },
      [...TRANSFORMERS, ...globalTransformers],
    );
    transformed.push({ pageContent, relativeOutFile });
  }

  categories.push(...categoriesData.map((category) => category.title));

  writeCategoriesJson(dsEnvironment, categories);

  return transformed;
};

/**
 * Creates a file containing an array of the categories from strapi
 */
function writeCategoriesJson(
  dsEnvironment: { distDir: string },
  categories: string[],
): void {
  const outFile = join(dsEnvironment.distDir, 'categories.json');

  // Creating folder path if it does not exist
  mkdirSync(dirname(outFile), { recursive: true });

  // Write file with page content to disc.
  writeFileSync(outFile, JSON.stringify(categories), {
    encoding: 'utf8',
  });
}

/**
 * Transform page metadata fetched from strapi
 * according to BaSinglePageMeta structure.
 */
function strapiMetaData(page: BaStrapiPage): BaSinglePageMeta {
  const metaData: BaSinglePageMeta = {
    title: page.title,
    layout: BaPageLayoutType.Default,
    category: page.category ? page.category.title : '',
  };

  // Set navgroup
  if (page.group) {
    metaData.navGroup = page.group;
  }

  // Set description
  if (page.description) {
    metaData.description = page.description;
  }

  // Set tags
  const tags = page.tags.map((tag) => tag.name) || [];
  if (tags.length > 0) {
    metaData.tags = tags;
  }

  // Set UX Wiki page link (only for internal Barista)
  if (!isPublicBuild() && page.wiki) {
    metaData.wiki = page.wiki;
  }

  // Set contributors
  if (page.contributors && page.contributors.length > 0) {
    metaData.contributors = {};
    const uxSupport = page.contributors
      .filter((c) => !c.developer)
      .map((c) => ({
        name: c.name,
        githubuser: c.githubuser,
      }));
    const devSupport = page.contributors
      .filter((c) => c.developer)
      .map((c) => ({
        name: c.name,
        githubuser: c.githubuser,
      }));

    if (uxSupport.length > 0) {
      metaData.contributors!.ux = uxSupport;
    }

    if (devSupport.length > 0) {
      metaData.contributors!.dev = devSupport;
    }
  }

  if (page.toc !== null) {
    metaData.toc = page.toc;
  }

  return metaData;
}
