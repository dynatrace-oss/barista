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
import { SemVer, parse } from 'semver';
import { BUNDLE_VERSION_ERROR } from './release-errors';

/**
 * Checks whether the version in the package.json in the
 * given path matches the version given.
 */
export async function verifyBundle(
  version: SemVer,
  bundlePath: string,
): Promise<void> {
  const bundlePackageJson = await tryJsonParse<PackageJson>(
    join(bundlePath, 'package.json'),
  );
  const parsedBundleVersion = parse(bundlePackageJson.version || '');
  if (!parsedBundleVersion || parsedBundleVersion.compare(version) !== 0) {
    throw new Error(BUNDLE_VERSION_ERROR);
  }
}
