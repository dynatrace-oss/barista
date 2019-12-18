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

import { join } from 'path';
import { sync as globSync } from 'glob';
import { promises as fs } from 'fs';
import * as lunr from 'lunr';
import { load as cheerioLoad } from 'cheerio';
import { BaSinglePageContent } from '@dynatrace/barista-components/barista-definitions';
import { environment } from 'tools/environments/barista-environment';

const DIST_DIR = environment.distDir;

/**
 * Defines the search index function fields configurations for the lunr
 * search index.
 */
export class LunrBuilder extends lunr.Builder {
  constructor() {
    super();

    // Define the id field as the reference one, this will be the url.
    this.ref('id');
    // Set a field title
    this.field('title');
    // Add the body as a search parameter as well.
    this.field('body');
    // Add the tags as a field.
    this.field('tags');

    // Use the trimmer and stopWordFilter in the index builder.
    this.pipeline.add(lunr.trimmer, lunr.stopWordFilter);

    this.metadataWhitelist = ['position'];
  }
}

/** Checks if the PageBuilderResult is a BaSinglePageContent. */
function pageContentIsBaSingle(
  contentResult: BaSinglePageContent,
): contentResult is BaSinglePageContent {
  return contentResult.hasOwnProperty('content');
}

/**
 * Generates a search index.json that can be read and used
 * by the nestjs backend and its lunr search.
 */
export async function searchIndexBuilder(): Promise<void> {
  const allFiles = globSync('**/**.json', { cwd: DIST_DIR });
  const builder = new LunrBuilder();

  for (const filePath of allFiles) {
    const file = await fs.readFile(join(DIST_DIR, filePath), {
      encoding: 'utf-8',
    });
    const parsedDocument: BaSinglePageContent = JSON.parse(file);

    // Convert filepath to assume the final url
    const url = filePath.replace('.json', '/');
    const title = parsedDocument.title;
    const tags = pageContentIsBaSingle(parsedDocument)
      ? parsedDocument.tags
      : [];
    const body = pageContentIsBaSingle(parsedDocument)
      ? cheerioLoad(parsedDocument.content)('body').text()
      : '';
    builder.add({
      id: url,
      title,
      body,
      tags,
    });
  }
  const index = builder.build();
  await fs.writeFile(
    join(DIST_DIR, '_search-index.json'),
    JSON.stringify(index),
    {
      flag: 'w', // "w" -> Create file if it does not exist
      encoding: 'utf8',
    },
  );
}
