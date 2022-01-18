/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import { PackageJson } from '../../interfaces';

/**
 * @internal
 * updates a dependency inside the package JSON,
 * if it does not exists it will add it
 * @param packageJson The package JSON
 * @param dependencyName The name of the dependency
 * @param version The desired version to be updated
 * @param addIfNotExists Adds the dependency if it does not exists
 */
export function updateDependency(
  packageJson: PackageJson,
  dependencyName: string,
  version: string,
  addIfNotExists = true,
): PackageJson {
  if (packageJson.dependencies?.hasOwnProperty(dependencyName)) {
    packageJson.dependencies[dependencyName] = version;
  } else if (packageJson.devDependencies?.hasOwnProperty(dependencyName)) {
    packageJson.devDependencies[dependencyName] = version;
  } else if (addIfNotExists) {
    packageJson.dependencies[dependencyName] = version;
  }

  return packageJson;
}
