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

import { promises as fs, mkdirSync } from 'fs';
import { dirname, join } from 'path';

import {
  BaPageBuildResult,
  BaPageBuilder,
} from '@dynatrace/barista-components/barista-definitions';
import { componentsBuilder } from './builder/components';
import { strapiBuilder } from './builder/strapi';
import { homepageBuilder } from './builder/homepage';
import { iconsBuilder } from './builder/icons';

// Add your page-builder to this map to register it.
const BUILDERS = new Map<string, BaPageBuilder>([
  ['components-builder', componentsBuilder],
  ['strapi-builder', strapiBuilder],
  ['homepage-builder', homepageBuilder],
  ['icons-builder', iconsBuilder],
]);

const DIST_DIR = join(__dirname, '../../', 'apps', 'barista', 'data');

/** Builds pages using all registered builders. */
async function buildPages(): Promise<void[]> {
  const builders = Array.from(BUILDERS.values());
  // Run each builder and collect all build results
  const results = await builders.reduce<Promise<BaPageBuildResult[]>>(
    async (aggregatedResults, currentBuilder) => [
      ...(await aggregatedResults),
      ...(await currentBuilder()),
    ],
    Promise.resolve([]),
  );

  // Make sure dist dir is created
  mkdirSync(DIST_DIR, { recursive: true });

  const files = results.map(async result => {
    const outFile = join(DIST_DIR, result.relativeOutFile);

    // Creating folder path if it does not exist
    mkdirSync(dirname(outFile), { recursive: true });

    // Write file with page content to disc.
    // tslint:disable-next-line: no-magic-numbers
    return fs.writeFile(outFile, JSON.stringify(result.pageContent, null, 2), {
      flag: 'w', // "w" -> Create file if it does not exist
      encoding: 'utf8',
    });
  });

  return Promise.all(files);
}

buildPages()
  .then(results => {
    console.log(`${results.length} Pages created.`);
  })
  .catch(err => {
    console.error(err);
  });
