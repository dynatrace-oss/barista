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

import { lstatSync, readdirSync } from 'fs';
import { basename, join } from 'path';
import { green, bold } from 'chalk';

import { getExampleMetadataObjects, BaristaExampleMetadata } from './metadata';
import { generateExamplesModule } from './generate-examples-module';
import { generateExamplesRoutingModule } from './generate-routing-module';
import { generateExamplesNavItems } from './generate-nav-items';

export const EXAMPLES_ROOT = join(
  __dirname,
  '../../../',
  'apps',
  'barista-examples',
  'src',
);

/** Collect and return all example-files in a provided directory. */
function getExampleFilesInDir(dir: string): string[] {
  return readdirSync(dir)
    .map(name => join(dir, name))
    .filter(
      file =>
        lstatSync(file).isFile() &&
        basename(file)
          .toLowerCase()
          .endsWith('-example.ts'),
    );
}

/** Collect all files containing examples in the barista-examples app. */
function getAllExampleFiles(): string[] {
  return readdirSync(EXAMPLES_ROOT)
    .map(name => join(EXAMPLES_ROOT, name))
    .filter(dir => lstatSync(dir).isDirectory())
    .reduce<string[]>(
      (aggregatedFiles, currentDir) => [
        ...aggregatedFiles,
        ...getExampleFilesInDir(currentDir),
      ],
      [],
    );
}

async function main(): Promise<void> {
  console.log();
  console.log(bold(`Generating Barista Examples`));
  console.log(`Collecting example files`);
  const exampleFiles = getAllExampleFiles();
  console.log(green(`  ✓   ${exampleFiles.length} files collected`));

  console.log('Collecting example component metadata');
  const metadata: BaristaExampleMetadata[] = [];
  for (const file of exampleFiles) {
    metadata.push(...(await getExampleMetadataObjects(file)));
  }
  console.log(
    green(`  ✓   ${metadata.length} examples with valid metadata found`),
  );

  console.log(`Generating examples module`);
  const examplesModuleFile = await generateExamplesModule(metadata);
  console.log(green(`  ✓   Created "${examplesModuleFile}"`));

  console.log(`Generating examples app routes & routing module`);
  const routingModule = await generateExamplesRoutingModule(metadata);
  console.log(green(`  ✓   Created "${routingModule}"`));

  console.log(`Generating nav-items for the examples app menu`);
  const navItemsFile = await generateExamplesNavItems(metadata);
  console.log(green(`  ✓   Created "${navItemsFile}"`));

  console.log(
    bold(
      green(
        `✓ All content for the barista-examples has been successfully generated`,
      ),
    ),
  );
  console.log();
}

main()
  .then(() => {})
  .catch(err => {
    console.error(err);
  });
