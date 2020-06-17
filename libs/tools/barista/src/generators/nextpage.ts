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
import { promises as fs } from 'fs';
import * as markdownIt from 'markdown-it';
import { join } from 'path';
import { NextStrapiPage, NextContentType } from '../types';
import { fetchContentList } from '../utils/fetch-strapi-content';

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

  const nextPages: NextStrapiPage[] = contentList.map((data) => ({
    id: data.id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    content: markdown.render(data.content),
    group: data.group,
    section: data.section,
  }));

  await fs.writeFile(
    join(environment.distDir, 'next-pages.json'),
    JSON.stringify(nextPages, null, 2),
    {
      flag: 'w', // "w" -> Create file if it does not exist
      encoding: 'utf8',
    },
  );
}
