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

import { PackageJson, tryJsonParse } from '@dynatrace/shared/node';
import { join } from 'path';
import { parse, SemVer } from 'semver';
import { GET_INVALID_PACKAGE_JSON_VERSION_ERROR } from './release-errors';

/**
 * Reads the package json in the given baseDir
 * and tries to parse the version as a semantic version
 *
 * @throws Will throw if no package.json is found or the version cannot be parsed
 */
export async function parsePackageVersion(baseDir: string): Promise<SemVer> {
  const packageJsonPath = join(baseDir, 'package.json');

  const packageJson = await tryJsonParse<PackageJson>(packageJsonPath);

  const parsedVersion: SemVer | null = parse(packageJson.version || '');

  if (!parsedVersion) {
    throw new Error(GET_INVALID_PACKAGE_JSON_VERSION_ERROR(packageJson));
  }
  return parsedVersion;
}
