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

import {
  chain,
  externalSchematic,
  Rule,
  SchematicContext,
} from '@angular-devkit/schematics';
import { Tree } from '@angular-devkit/schematics/src/tree/interface';
import { join } from 'path';
import {
  getPackageVersionFromPackageJson,
  readFileFromTree,
} from '../../utils';
import { ExtendedSchema } from '../schema';
import { addDependencies } from './add-dependencies';
import { NodeDependency } from './add-package-json-dependency';
import { removeDependencies } from './remove-dependencies';

const ERROR_MISSING_DEPENDENCY = (dependency: string) => `
'The dependency ${dependency} is not installed in your workplace!'`;

/** Check for angular/barista-components in package.json */
export function migrateOrAddDependenciesRule(options: ExtendedSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const packageJSON = readFileFromTree(tree, '/package.json');
    const rules: Rule[] = [];
    const newDependencies: NodeDependency[] = [];

    // if a legacy version of the non open source version is installed
    // we have to migrate it to the @dynatrace/barista-components
    // installing the new package and refactoring all the imports
    if (options.migration) {
      // refactor all dt-iconpack and angular-components imports
      rules.push(migrateToVersion5(options));
      // remove the old dependency from the package json
      rules.push(
        removeDependencies(['@dynatrace/angular-components'], '/package.json'),
      );
    } else {
      // Check if the following packages are installed otherwise we cannot continue
      // installing our barista components.
      ['@angular/core', '@angular/common'].forEach(requiredPgk => {
        if (!packageJSON.includes(requiredPgk)) {
          const errorMessage = ERROR_MISSING_DEPENDENCY(requiredPgk);
          context.logger.error(errorMessage);
          throw errorMessage;
        }
      });
      const ngCoreVersionTag = getPackageVersionFromPackageJson(
        tree,
        '@angular/core',
      )!;

      if (options.animations) {
        options.peerDependencies[
          '@angular/platform-browser-dynamic'
        ] = ngCoreVersionTag;
        options.peerDependencies['@angular/animations'] = ngCoreVersionTag;
      }
    }

    for (const peerDependency of Object.keys(options.peerDependencies)) {
      const version = options.peerDependencies[peerDependency];

      newDependencies.push({
        name: peerDependency,
        version: version,
      });
    }

    // always add the new version of the barista components
    newDependencies.push({
      name: '@dynatrace/barista-components',
      version: options.componentsVersion,
    });

    rules.push(addDependencies(newDependencies, '/package.json'));
    return chain(rules)(tree, context);
  };
}

/** Check filesystem for imports of dynatrace/angular-components and rename then to barista-components */
function migrateToVersion5(options: ExtendedSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [];
    const collectionPath = join(__dirname, '../../collection.json');
    // run external migration schematics
    rules.push(externalSchematic(collectionPath, 'update-5.0.0', {}));

    return chain(rules)(tree, context);
  };
}
