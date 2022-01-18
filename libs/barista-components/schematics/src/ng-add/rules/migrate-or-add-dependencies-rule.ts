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

import {
  chain,
  externalSchematic,
  Rule,
  SchematicContext,
} from '@angular-devkit/schematics';
import { Tree } from '@angular-devkit/schematics/src/tree/interface';
import { join } from 'path';
import { PackageJson } from '../../interfaces/package-json.interface';
import { updateJsonInTree } from '../../utils';
import { ExtendedSchema } from '../schema';

/** Check for angular/barista-components in package.json */
export function migrateOrAddDependenciesRule(options: ExtendedSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [
      // always add the new version of the barista components
      updateJsonInTree('package.json', (json: PackageJson) => {
        json.dependencies = json.dependencies || {};
        json.dependencies['@dynatrace/barista-components'] =
          options.componentsVersion;
        return json;
      }),
    ];

    for (const peerDependency of Object.keys(options.peerDependencies)) {
      const version = options.peerDependencies[peerDependency];
      rules.push(
        updateJsonInTree('package.json', (json: PackageJson) => {
          json.dependencies = json.dependencies || {};
          json.dependencies[peerDependency] = version;
          return json;
        }),
      );
    }

    // if a legacy version of the non open source version is installed
    // we have to migrate it to the @dynatrace/barista-components
    // installing the new package and refactoring all the imports
    if (options.migration) {
      // refactor all dt-iconpack and angular-components imports
      rules.push(migrateToVersion5(options));
      rules.push(
        updateJsonInTree('package.json', (json: PackageJson) => {
          json.dependencies = json.dependencies || {};
          delete json.dependencies['@dynatrace/angular-components'];
          return json;
        }),
      );
    }

    return chain(rules)(tree, context);
  };
}

/** Check filesystem for imports of dynatrace/angular-components and rename then to barista-components */
function migrateToVersion5(_options: ExtendedSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [];
    const collectionPath = join(__dirname, '../../../collection.json');
    // run external migration schematics
    rules.push(externalSchematic(collectionPath, 'update-5.0.0', {}));

    return chain(rules)(tree, context);
  };
}
