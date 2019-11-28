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

import { executeCommand } from '@dynatrace/barista-components/tools/shared';
import { SemVer } from 'semver';
import {
  NPM_PUBLISH_FAILED_ERROR,
  YARN_PUBLISH_FAILED_ERROR,
} from './release-errors';
import { green } from 'chalk';

/** Publish package to npm and our internal registry with yarn  */
export async function publishPackage(
  packagePath: string,
  version: SemVer,
): Promise<void> {
  console.info(`Starting publishing package to npm: `);
  await npmPublish(packagePath, version);
  console.log(green(`✔︎ Successfully published the version: ${version.raw}`));

  console.info(`Starting publishing package to our internal registry: `);
  await yarnPublish(packagePath, version);
  console.log(green('✔︎ Successfully published internal version!'));
}

/** Runs NPM publish within a specified directory */
export async function npmPublish(
  packagePath: string,
  version: SemVer,
): Promise<void> {
  const command = ['npm publish', '--access=public', `--tag=${version.raw}`];

  if (process.env.DEBUG) {
    command.push('--dry-run');
  }

  try {
    await executeCommand(command.join(' '), packagePath);
  } catch (error) {
    throw Error(NPM_PUBLISH_FAILED_ERROR(error.message));
  }
}

/** Publish the package to the internal registry with yarn */
export async function yarnPublish(
  packagePath: string,
  version: SemVer,
): Promise<void> {
  const command = ['yarn publish', '--verbose', `--new-version=${version.raw}`];

  command.push(packagePath);

  try {
    await executeCommand(command.join(' '));
  } catch (error) {
    throw Error(YARN_PUBLISH_FAILED_ERROR(error.message));
  }
}
