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

import { Tree } from '@angular-devkit/schematics';
import { readJsonAsObjectFromTree } from './json';
import {
  PackageJson,
  PackageJsonDependencyType,
} from '../interfaces/package-json.interface';

/**
 * Gets the version of the specified package by looking at the package.json in the given tree.
 * @param tree The host tree where to look for the file
 * @param name The package name that should be found
 * @param packagePath A different path to the `package.json` default in the root
 */
export function getPackageVersionFromPackageJson(
  tree: Tree,
  name: string,
  packagePath: string = 'package.json',
): string | null {
  const packageJson = readJsonAsObjectFromTree<PackageJson>(tree, packagePath);

  for (const dependencyType of Object.values(PackageJsonDependencyType)) {
    if (packageJson[dependencyType] && packageJson[dependencyType][name]) {
      return packageJson[dependencyType][name];
    }
  }

  return null;
}
