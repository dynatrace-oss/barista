/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import { isPublicBuild } from '@dynatrace/shared/node';
import { environment } from '@environments/barista-environment';
import {
  fetchContentList,
  fetchContentItemById,
} from '@dynatrace/shared/data-access-strapi';

import {
  BaPageBuildResult,
  BaPageBuilder,
  BaStrapiPageTeaser,
  BaStrapiContentType,
  BaStrapiCTA,
} from '../types';
import {
  BaIndexPageContent,
  BaPageLayoutType,
} from '@dynatrace/shared/design-system/interfaces';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BaHomepageBuilder = (...args: any[]) => BaPageBuildResult;

/** Page-builder for the homepage of Barista. */
export const homepageBuilder: BaPageBuilder = async () => {
  let pageTeaserData: BaStrapiPageTeaser[] = [];
  let homepageCTA;

  if (environment.strapiEndpoint) {
    pageTeaserData = await fetchContentList<BaStrapiPageTeaser>(
      BaStrapiContentType.Pageteasers,
      { publicContent: false }, // always false because pageteasers don't have a public flag
      environment.strapiEndpoint,
    );

    // Filter page teasers that link to internal pages.
    if (isPublicBuild() && pageTeaserData.length) {
      pageTeaserData = pageTeaserData.filter((teaser) =>
        teaser.page ? teaser.page.public : true,
      );
    }

    // Filter page teasers that link to draft pages.
    pageTeaserData = pageTeaserData.filter((teaser) =>
      teaser.page ? !teaser.page.draft : true,
    );

    homepageCTA = await fetchContentItemById<BaStrapiCTA>(
      BaStrapiContentType.CTAs,
      '1',
      { publicContent: isPublicBuild() },
      environment.strapiEndpoint,
    );
  }

  const relativeOutFile = 'index.json';
  const pageContent: BaIndexPageContent = {
    title: 'Barista - the Dynatrace design system.',
    subtitle: 'Tailored to scale.',
    layout: BaPageLayoutType.Index,
    mostordered: TILES_MOSTORDERED,
    gettingstarted: pageTeaserData,
    cta: homepageCTA,
  };

  return [{ pageContent, relativeOutFile }];
};
