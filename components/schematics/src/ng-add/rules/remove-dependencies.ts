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

import { Rule, Tree } from '@angular-devkit/schematics';
import { PackageJsonDependencyType } from '../../interfaces/package-json.interface';
import { readJsonFromTree, findJsonPropertyInAst } from '../../utils';

/**
 * Adds Dependencies to the package.json
 * Used to add library specific dependencies.
 * @param options from schema.d.ts
 */
export function removeDependencies(
  dependencies: string[],
  packageJsonPath: string,
): Rule {
  return (host: Tree) => {
    // if no dependencies are provided early exit
    if (!dependencies.length) {
      return host;
    }

    // loop over all dependencies and add them to the json.
    dependencies.forEach((dependency: string) => {
      // add dependency to the package.json
      removeDependency(host, dependency, packageJsonPath);
    });
    return host;
  };
}

function removeDependency(tree: Tree, dependency: string, path: string): void {
  const packageJsonAst = readJsonFromTree(tree, path);
  const depsNode = findJsonPropertyInAst(
    packageJsonAst,
    PackageJsonDependencyType.Default,
  );

  if (depsNode && depsNode.kind === 'object') {
    for (const property of depsNode.properties) {
      if (property.key.text === `"${dependency}"`) {
        const recorder = tree.beginUpdate(path);
        const { end, start } = property;
        recorder.remove(start.offset, end.offset - start.offset);
        tree.commitUpdate(recorder);
      }
    }
  }
}
