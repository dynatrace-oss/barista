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

import { isPublicBuild } from '@dynatrace/shared/node';
import { green, bold } from 'chalk';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import { EOL } from 'os';
import { dirname, join } from 'path';
import { componentsBuilder } from './builder/components';
import { homepageBuilder } from './builder/homepage';
import { iconsBuilder } from './builder/icons';
import { strapiBuilder } from './builder/strapi';
import {
  exampleInlineSourcesTransformerFactory,
  internalContentTransformerFactory,
  internalLinksTransformerFactory,
} from './transform';
import { BaPageBuilder, BaPageBuildResult, BaPageTransformer } from './types';
import { sync } from 'glob';
import {
  uxDecisionGraphGenerator,
  overviewBuilder,
  navigationBuilder,
} from './generators';
import { options } from 'yargs';
import {
  getExamplesInPackages,
  generateExamplesLibMetadataFile,
} from './utils/examples';
import { environment } from '@environments/barista-environment';

// Add your page-builder to this map to register it.

const BARISTA_BUILDERS = new Map<string, BaPageBuilder>([
  ['components-builder', componentsBuilder],
  ['strapi-builder', strapiBuilder],
  ['homepage-builder', homepageBuilder],
  ['icons-builder', iconsBuilder],
]);

const NEXT_BUILDERS = new Map<string, BaPageBuilder>([
  ['strapi-builder', strapiBuilder],
]);

/**
 * Creates the internalLinksTransformer via a factory because we need to read
 * some arguments from the process environment.
 * Transformers should be pure for testing.
 */
function createInternalLinksTransformer(
  linkReplacement?: string,
): BaPageTransformer {
  const internalLinkParts = linkReplacement ? linkReplacement.split(',') : [];
  const isPublic = isPublicBuild();
  return internalLinksTransformerFactory(isPublic, internalLinkParts);
}

/**
 * Creates the internalContentTransformer via a factory because we need to read
 * one argument from the process environment.
 */
function createInternalContentTransformer(): BaPageTransformer {
  const isPublic = isPublicBuild();
  return internalContentTransformerFactory(isPublic);
}

/**
 * Creates the exampleInlineSourcesTransformer by loading the example
 * metadata-json and calling the factory with it.
 */
async function createExampleInlineSourcesTransformer(): Promise<
  BaPageTransformer
> {
  const examplesMetadataDir = './dist';
  const examplesMetadataFileName = 'examples-metadata.json';
  if (!existsSync(examplesMetadataDir)) {
    throw new Error(`"${examplesMetadataFileName}" not found.`);
  }
  const examplesMetadata = await fs.readFile(
    join(examplesMetadataDir, examplesMetadataFileName),
    {
      encoding: 'utf8',
    },
  );

  return exampleInlineSourcesTransformerFactory(JSON.parse(examplesMetadata));
}
/** Defines the paths for our DS's */
const nextEnvironment = { distDir: 'dist/next-data' };
const baristaEnvironment = { distDir: 'dist/barista-data' };

/** Builds pages using all registered builders. */
async function buildPages(): Promise<void[]> {
  const { next } = options({
    next: { type: 'boolean', alias: 'n', default: false },
  }).argv;

  console.log(`Generating examples lib metadata file for barista`);
  const packageMetas = await getExamplesInPackages();
  const metadataFile = await generateExamplesLibMetadataFile(packageMetas);
  console.log(green(`  ✓   Created "${metadataFile}"`));

  console.log(
    bold(
      green(
        `✓ All content for the demos & barista app has been successfully generated`,
      ),
    ),
  );
  console.log();

  const env = next ? nextEnvironment : baristaEnvironment;
  const globalTransformers = next
    ? []
    : [
        await createExampleInlineSourcesTransformer(),
        createInternalLinksTransformer(environment.internalLinks),
        createInternalContentTransformer(),
      ];

  const builders = Array.from(
    next ? NEXT_BUILDERS.values() : BARISTA_BUILDERS.values(),
  );
  // Run each builder and collect all build results
  const results = await builders.reduce<Promise<BaPageBuildResult[]>>(
    async (aggregatedResults, currentBuilder) => [
      ...(await aggregatedResults),
      ...(await currentBuilder(globalTransformers, next, env)),
    ],
    Promise.resolve([]),
  );

  // Make sure dist dir is created
  mkdirSync(env.distDir, { recursive: true });

  const files = results.map(async (result) => {
    const outFile = join(env.distDir, result.relativeOutFile);

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
  if (next) {
    await navigationBuilder();
  }
  if (!isPublicBuild()) {
    await uxDecisionGraphGenerator();
  }

  const routes = sync(`${env.distDir}/**/*.json`)
    .map((file) => {
      const path = file.replace(env.distDir, '').replace(/\..+$/, ''); // replace the file ending

      switch (path) {
        case 'index':
          return '/';
        case 'nav':
          return;
        default:
          return path;
      }
    })
    .filter(Boolean)
    .join(EOL);

  const routesFile = join(env.distDir, 'routes.txt');
  // write the barista and next routes to a own file that can be used for pre rendering
  fs.writeFile(routesFile, routes, 'utf-8');
  console.log(
    green('\n✅ Successfully created routes.txt file for pre-rendering\n'),
  );

  return [...allPages, ...overviewPages];
}

buildPages()
  .then(async (results) => {
    console.log(`${results.length} pages created.`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
