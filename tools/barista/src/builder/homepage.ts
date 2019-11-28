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

import { isPublicBuild } from '@dynatrace/barista-components/tools/shared';
import { environment } from 'tools/environments/barista-environment';
import {
  fetchContentList,
  fetchContentItemById,
} from '../utils/fetch-strapi-content';

import {
  BaPageBuildResult,
  BaPageBuilder,
  BaStrapiPageTeaser,
  BaStrapiContentType,
  BaIndexPageContent,
  BaStrapiCTA,
} from '@dynatrace/barista-components/barista-definitions';

const TILES_MOSTORDERED = [
  {
    title: 'Icons',
    category: 'Resources',
    link: '/resources/icons',
  },
  {
    title: 'Colors',
    category: 'Resources',
    link: '/resources/colors',
  },
  {
    title: 'Button',
    category: 'Components',
    link: '/components/button',
  },
  {
    title: 'Table',
    category: 'Components',
    link: '/components/table',
  },
  {
    title: 'Chart',
    category: 'Components',
    link: '/components/chart',
  },
  {
    title: 'Filter field',
    category: 'Components',
    link: '/components/filter-field',
  },
  {
    title: 'Card',
    category: 'Components',
    link: '/components/card',
  },
];

// tslint:disable-next-line: no-any
export type BaHomepageBuilder = (...args: any[]) => BaPageBuildResult;

/** Page-builder for the homepage of Barista. */
export const homepageBuilder: BaPageBuilder = async () => {
  let pageTeaserData;
  let homepageCTA;

  if (environment.strapiEndpoint) {
    pageTeaserData = await fetchContentList<BaStrapiPageTeaser>(
      BaStrapiContentType.Pageteasers,
      { publicContent: false }, // always false because pageteasers don't have a public flag
      environment.strapiEndpoint,
    );

    // Filter page teasers that link to internal pages.
    if (isPublicBuild() && pageTeaserData.length) {
      pageTeaserData = pageTeaserData.filter(teaser =>
        teaser.page ? teaser.page.public : true,
      );
    }

    // Filter page teasers that link to draft pages.
    pageTeaserData = pageTeaserData.filter(teaser =>
      teaser.page ? !teaser.page.draft : true,
    );

    homepageCTA = await fetchContentItemById<BaStrapiCTA>(
      BaStrapiContentType.CTAs,
      '1',
      { publicContent: isPublicBuild() },
      environment.strapiEndpoint,
    );
  }

  const relativeOutFile = '/index.json';
  const pageContent: BaIndexPageContent = {
    title: 'Barista - the Dynatrace design system.',
    subtitle: 'Tailored to scale.',
    layout: 'index',
    mostordered: TILES_MOSTORDERED,
    gettingstarted: pageTeaserData,
    cta: homepageCTA,
  };

  return [{ pageContent, relativeOutFile }];
};
