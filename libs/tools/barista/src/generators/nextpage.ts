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

import { environment } from '@environments/barista-environment';
import * as markdownIt from 'markdown-it';
import { join } from 'path';
import { NextStrapiPage, NextContentType } from '../types';
import { fetchContentList } from '../utils/fetch-strapi-content';
import { slugify } from '../utils/slugify';
import { existsSync, mkdir, writeFile } from 'fs';

const markdown = new markdownIt({
  html: true,
  typographer: false,
});

/** Generates data for the UX Decision Graph */
export async function nextPagesGenerator(): Promise<never[] | undefined> {
  // Return here if no endpoint is given.
  if (!environment.strapiEndpoint) {
    console.log('No Strapi endpoint given.');
    return [];
  }

  const contentList = await fetchContentList<NextStrapiPage>(
    NextContentType.NextPages,
    { publicContent: false },
    environment.strapiEndpoint,
  );
  if (!existsSync(join(environment.distDir, 'next'))) {
    mkdir(join(environment.distDir, 'next'), () => {});
  }

  contentList.forEach((data) => {
    const sectionData = data.section !== null ? slugify(data.section) : null;

    const nextPage = {
      id: data.id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      content: markdown.render(data.content),
      group: slugify(data.group),
      section: sectionData,
    };

    if (data.section !== null) {
      generateDetailPage(nextPage, slugify(data.group), slugify(data.section));
    } else {
      generateOverviewPage(nextPage, slugify(data.group));
    }
  });
}

async function generateOverviewPage(
  nextPage: NextStrapiPage,
  dataGroup: string,
): Promise<void> {
  writeFile(
    join(environment.distDir, `next/${dataGroup}.json`),
    JSON.stringify(nextPage, null, 2),
    {
      flag: 'w', // "w" -> Create file if it does not exist
      encoding: 'utf8',
    },
    () => {},
  );
}

async function generateDetailPage(
  nextPage: NextStrapiPage,
  dataGroup: string,
  dataSection: string,
): Promise<void> {
  mkdir(join(environment.distDir, `next/${dataGroup}`), () => {});
  writeFile(
    join(
      environment.distDir,
      `next/${slugify(dataGroup)}/${slugify(dataSection)}.json`,
    ),
    JSON.stringify(nextPage, null, 2),
    {
      flag: 'w', // "w" -> Create file if it does not exist
      encoding: 'utf8',
    },
    () => {},
  );
}
