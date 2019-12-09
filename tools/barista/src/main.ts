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

import { dirname, join } from 'path';
import { promises as fs, mkdirSync, existsSync } from 'fs';

import {
  BaPageBuildResult,
  BaPageBuilder,
  BaPageTransformer,
} from '@dynatrace/barista-components/barista-definitions';
import { componentsBuilder } from './builder/components';
import { strapiBuilder } from './builder/strapi';
import { homepageBuilder } from './builder/homepage';
import { iconsBuilder } from './builder/icons';
import { overviewBuilder } from './generators/category-navigation';
import { isPublicBuild } from './utils/is-public-build';
import {
  internalLinksTransformerFactory,
  exampleInlineSourcesTransformerFactory,
} from './transform';

// Add your page-builder to this map to register it.
const BUILDERS = new Map<string, BaPageBuilder>([
  ['components-builder', componentsBuilder],
  ['strapi-builder', strapiBuilder],
  ['homepage-builder', homepageBuilder],
  ['icons-builder', iconsBuilder],
]);

const PROJECT_ROOT = join(__dirname, '../../../');
const DIST_DIR = join(PROJECT_ROOT, 'dist', 'apps', 'barista', 'data');
const EXAMPLES_METADATA = join(PROJECT_ROOT, 'dist', 'examples-metadata.json');

/**
 * Creates the internalLinksTransformer via a factory because we need to read
 * some arguments from the process environment.
 * Transformers should be pure for testing.
 */
function createInternalLinksTransformer(): BaPageTransformer {
  const internalLinkArg = process.env.INTERNAL_LINKS;
  const internalLinkParts = internalLinkArg ? internalLinkArg.split(',') : [];
  const isPublic = isPublicBuild();
  return internalLinksTransformerFactory(isPublic, internalLinkParts);
}

/**
 * Creates the exampleInlineSourcesTransformer by loading the example
 * metadata-json and calling the factory with it.
 */
async function createExampleInlineSourcesTransformer(): Promise<
  BaPageTransformer
> {
  if (!existsSync(EXAMPLES_METADATA)) {
    throw new Error(
      '"examples-metadata.json" not found. Make sure to run "examples-tools" first.',
    );
  }
  const examplesMetadata = (await fs.readFile(EXAMPLES_METADATA, {
    encoding: 'utf8',
  })).toString();

  return exampleInlineSourcesTransformerFactory(JSON.parse(examplesMetadata));
}

/** Builds pages using all registered builders. */
async function buildPages(): Promise<void[]> {
  const globalTransformers = [
    await createExampleInlineSourcesTransformer(),
    createInternalLinksTransformer(),
  ];

  const builders = Array.from(BUILDERS.values());
  // Run each builder and collect all build results
  const results = await builders.reduce<Promise<BaPageBuildResult[]>>(
    async (aggregatedResults, currentBuilder) => [
      ...(await aggregatedResults),
      ...(await currentBuilder(globalTransformers)),
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

  const allPages = await Promise.all(files);
  const overviewPages = await overviewBuilder();

  return [...allPages, ...overviewPages];
}

buildPages()
  .then(async results => {
    console.log(`${results.length} pages created.`);
  })
  .catch(err => {
    console.error(err);
  });
