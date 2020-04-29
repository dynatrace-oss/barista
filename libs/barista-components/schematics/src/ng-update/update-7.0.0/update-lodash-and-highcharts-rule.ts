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

import { Rule, SchematicContext, chain } from '@angular-devkit/schematics';
import { Tree } from '@angular-devkit/schematics/src/tree/interface';
import { getMatchingFilesFromTree, updateJsonInTree } from '../../utils';
import { PackageJson } from '../../interfaces/package-json.interface';

export function migratePeerDependecies(dependenciesSchema: PackageJson): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [];
    const packageJsons = getMatchingFilesFromTree(tree, (filePath) =>
      filePath.endsWith('package.json'),
    );

    // update dependecies
    packageJsons.forEach((packageJson) => {
      rules.push(
        updateJsonInTree(packageJson, (json: PackageJson) => {
          // rename lodash to lodash-es
          json.dependencies = json.dependencies || {};
          json.devDependencies = json.devDependencies || {};
          if (json.dependencies['lodash']) {
            json.dependencies = renameProp(
              'lodash',
              'lodash-es',
              json.dependencies,
            );
          }
          // update dependencies
          Object.keys(dependenciesSchema.dependencies).forEach((key) => {
            const version = dependenciesSchema.dependencies[key];
            json.dependencies[key] = version;
            return json;
          });
          // update devDependencies
          Object.keys(dependenciesSchema.devDependencies).forEach((key) => {
            const version = dependenciesSchema.devDependencies[key];
            json.devDependencies[key] = version;
            return json;
          });
          return json;
        }),
      );
    });
    return chain(rules)(tree, context);
  };
}

/** Renames an objects key without mutating */
const renameProp = (oldProp, newProp, { [oldProp]: old, ...others }) => {
  return {
    [newProp]: old,
    ...others,
  };
};
