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

import { lstatSync, readdirSync } from 'fs';
import { join } from 'path';
import { bold, green } from 'chalk';
import { environment } from '@environments/barista-environment';
import {
  getExamplePackageMetadata,
  ExamplePackageMetadata,
  ExampleMetadata,
} from './metadata';
import { generateExamplesLibBarrelFile } from './generate-examples-lib-barrel';
import { generateExamplesLibModule } from './generate-examples-lib-module';
import { generateDemosAppRoutingModule } from './generate-routing-module';
import { generateDemosAppNavItems } from './generate-nav-items';
import { generateExamplesLibMetadataFile } from './generate-examples-lib-metadata';

/** Collect all files containing examples in the demos app. */
async function getExamplesInPackages(): Promise<ExamplePackageMetadata[]> {
  return (
    await Promise.all(
      readdirSync(environment.examplesLibDir)
        .map(name => join(environment.examplesLibDir, name))
        .filter(dir => lstatSync(dir).isDirectory())
        .map(dir => getExamplePackageMetadata(dir)),
    )
  ).filter(Boolean) as ExamplePackageMetadata[];
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

  console.log(`Generating examples lib barrel file`);
  const rootBarrelFile = await generateExamplesLibBarrelFile(
    packageMetas,
    environment.examplesLibDir,
  );
  console.log(green(`  ✓   Created "${rootBarrelFile}"`));

  console.log(`Generating examples lib module file`);
  const demosModuleFile = await generateExamplesLibModule(
    packageMetas,
    environment.examplesLibDir,
  );
  console.log(green(`  ✓   Created "${demosModuleFile}"`));

  console.log(`Generating demos app routes & routing module`);
  const routingModule = await generateDemosAppRoutingModule(
    examples,
    environment.demosAppDir,
  );
  console.log(green(`  ✓   Created "${routingModule}"`));

  console.log(`Generating nav-items for the demos app menu`);
  const navItemsFile = await generateDemosAppNavItems(
    packageMetas,
    environment.demosAppDir,
  );
  console.log(green(`  ✓   Created "${navItemsFile}"`));

  console.log(`Generating examples lib metadata file for barista`);
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
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
