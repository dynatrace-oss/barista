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

import { PackageJson } from '@dynatrace/shared/node';

/**
 * Syncs versions from the source to the target package.json
 *
 * @param sourcePackageJson - Package.json that contains all currently used
 * dependencies, devDependecies and peerDependencies that are used in the
 * project.
 * @param targetPackageJson - Package.json that is meant for shipping.
 * It contains the dependency/devDependency key but no version. It will receive
 * the version from the SourePackageJson
 * @param key - Which dependencies from the targetPackageJson should be
 * iterated.
 * @returns The modified targetPackageJson with all versions filled.
 */
export function syncDependencyVersions(
  sourcePackageJson: PackageJson,
  targetPackageJson: PackageJson,
  key: 'dependencies' | 'devDependencies' | 'peerDependencies',
): PackageJson {
  // Sync dependency versions, that are referenced in the release package.json
  for (const dependencyKey of Object.keys(targetPackageJson[key]!)) {
    const dependencyVersion =
      sourcePackageJson.dependencies![dependencyKey] ||
      sourcePackageJson.devDependencies![dependencyKey];
    targetPackageJson[key]![dependencyKey] = dependencyVersion;
  }
  return targetPackageJson;
}
