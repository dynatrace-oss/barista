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

import { options } from 'yargs';
import { green, bold } from 'chalk';
import { yarnPublish, NO_TOKEN_PROVIDED_ERROR } from '../utils';
import { join, dirname } from 'path';
import { SemVer } from 'semver';
import { sync } from 'glob';

export async function publishReleaseNext(workspaceRoot: string): Promise<void> {
  const { packageVersion } = options({
    packageVersion: { type: 'string', demandOption: true },
  }).argv;

  const environmentConfigs = [
    'ARTIFACTORY_URL',
    'NPM_INTERNAL_USER',
    'NPM_INTERNAL_PASSWORD',
  ];

  environmentConfigs.forEach((variableName: string) => {
    if (!process.env[variableName]) {
      throw new Error(NO_TOKEN_PROVIDED_ERROR(variableName));
    }
  });

  console.info();
  console.info(green('-----------------------------------------'));
  console.info(green(bold('  Dynatrace Barista Next release script')));
  console.info(green('-----------------------------------------'));
  console.info();

  // Publish design tokens
  console.info('Publishing design tokens');
  const version = new SemVer(packageVersion);
  await yarnPublish(
    join(workspaceRoot, './dist/libs/shared/design-tokens/'),
    version,
    workspaceRoot,
  );
  console.info(green('Successfully published design tokens'));

  // Publish elements
  const packages = sync('**/package.json', {
    cwd: './dist/libs/fluid-elements',
  });
  for (const elementPackage of packages) {
    const packageName = dirname(elementPackage);
    console.info('Publishing web component', packageName);
    await yarnPublish(
      join(workspaceRoot, './dist/libs/fluid-elements/', packageName),
      version,
      workspaceRoot,
    );
    console.info(green('Successfully published web component', packageName));
  }
}
