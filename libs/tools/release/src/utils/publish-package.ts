/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { executeCommand } from '@dynatrace/shared/node';
import axios from 'axios';
import { green } from 'chalk';
import { promises as fs } from 'fs';
import { join } from 'path';
import { SemVer } from 'semver';
import {
  NPM_PUBLISH_FAILED_ERROR,
  YARN_PUBLISH_FAILED_ERROR,
} from './release-errors';

/** Publish package to npm and our internal registry with yarn  */
export async function publishPackage(
  workspace: string,
  packagePath: string,
  version: SemVer,
): Promise<void> {
  console.info(`Starting publishing package to npm: `);
  await npmPublish(packagePath);
  console.log(green(`✔︎ Successfully published the version: ${version.raw}`));

  console.info(`Starting publishing package to our internal registry: `);
  await yarnPublish(packagePath, version, workspace);
  console.log(green('✔︎ Successfully published internal version!'));
}

/** Runs NPM publish within a specified directory */
export async function npmPublish(packagePath: string): Promise<void> {
  const command = ['npm publish', '--access=public'];

  if (process.env.DEBUG) {
    command.push('--dry-run');
  }

  try {
    await createNpmrcFile(packagePath);
    await executeCommand(command.join(' '), packagePath);
  } catch (error) {
    throw Error(NPM_PUBLISH_FAILED_ERROR(error.message));
  }
}

/** Publish the package to the internal registry with yarn */
export async function yarnPublish(
  packagePath: string,
  version: SemVer,
  workspace: string,
): Promise<void> {
  const command = [
    'yarn publish',
    '--verbose',
    `--new-version=${version.raw}`,
    packagePath,
  ];
  try {
    await createInternalNpmrcFile(workspace);
    await executeCommand(command.join(' '));
  } catch (error) {
    throw Error(YARN_PUBLISH_FAILED_ERROR(error.message));
  }
}

/** creates .npmrc file for public release */
export async function createNpmrcFile(folder: string): Promise<void> {
  const content = `//registry.npmjs.org/:_authToken=${process.env.NPM_PUBLISH_TOKEN}`;
  const filePath = join(folder, '.npmrc');

  await fs.writeFile(filePath, content, { encoding: 'utf-8', flag: 'w' });
}

/** creates .npmrc file for internal release */
export async function createInternalNpmrcFile(folder: string): Promise<void> {
  const artifactoryUrl = process.env.ARTIFACTORY_URL;
  const filePath = join(folder, '.npmrc');
  const auth = await axios.get(`${artifactoryUrl}api/npm/auth`, {
    auth: {
      username: process.env.NPM_INTERNAL_USER!,
      password: process.env.NPM_INTERNAL_PASSWORD!,
    },
  });

  const content =
    `@dynatrace:registry=${artifactoryUrl}api/npm/npm-dynatrace-release-local/\n` +
    `${auth.data}`;

  await fs.writeFile(filePath, content, { encoding: 'utf-8', flag: 'w' });
}
