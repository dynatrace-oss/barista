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
import { join } from 'path';
import { bold, green } from 'chalk';
import {
  getExamplePackageMetadata,
  ExamplePackageMetadata,
  ExampleMetadata,
} from './metadata';
import { generateExamplesLibBarrelFile } from './generate-examples-lib-barrel';
import { generateExamplesModule } from './generate-examples-module';
import { generateExamplesRoutingModule } from './generate-routing-module';
import { generateExamplesNavItems } from './generate-nav-items';
// import { generateExamplesModule } from './generate-examples-module';

// import { getExampleMetadataObjects, BaristaExampleMetadata } from './metadata';
// import { generateExamplesModule } from './generate-examples-module';
// import { generateExamplesRoutingModule } from './generate-routing-module';
// import { generateExamplesNavItems } from './generate-nav-items';

export const EXAMPLES_ROOT = join(
  __dirname,
  '../../../',
  'libs',
  'examples',
  'src',
);
export const DEMO_APP_ROOT = join(
  __dirname,
  '../../../',
  'apps',
  'barista-examples',
  'src',
);

/** Collect all files containing examples in the barista-examples app. */
async function getExamplesInPackages(): Promise<ExamplePackageMetadata[]> {
  return (await Promise.all(
    readdirSync(EXAMPLES_ROOT)
      .map(name => join(EXAMPLES_ROOT, name))
      .filter(dir => lstatSync(dir).isDirectory())
      .map(dir => getExamplePackageMetadata(dir)),
  )).filter(Boolean) as ExamplePackageMetadata[];
}

async function main(): Promise<void> {
  console.log();
  console.log(bold(`Generating Barista Examples`));
  console.log(`Collecting example and module files and extracting metadata`);
  const packageMetas = await getExamplesInPackages();
  const examples = packageMetas.reduce<ExampleMetadata[]>(
    (aggregatedExamples, packageMeta) => [
      ...aggregatedExamples,
      ...packageMeta.examples,
    ],
    [],
  );
  console.log(
    green(
      `  ✓   ${packageMetas.length} packages with ${examples.length} examples found`,
    ),
  );

  console.log(`Generating lib barrel file`);
  const rootBarrelFile = await generateExamplesLibBarrelFile(
    packageMetas,
    EXAMPLES_ROOT,
  );
  console.log(green(`  ✓   Created "${rootBarrelFile}"`));

  console.log(`Generating examples module for demo app`);
  const demoModuleFile = await generateExamplesModule(
    packageMetas,
    DEMO_APP_ROOT,
  );
  console.log(green(`  ✓   Created "${demoModuleFile}"`));

  console.log(`Generating demo app routes & routing module`);
  const routingModule = await generateExamplesRoutingModule(
    examples,
    DEMO_APP_ROOT,
  );
  console.log(green(`  ✓   Created "${routingModule}"`));

  console.log(`Generating nav-items for the demo app menu`);
  const navItemsFile = await generateExamplesNavItems(
    packageMetas,
    DEMO_APP_ROOT,
  );
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
