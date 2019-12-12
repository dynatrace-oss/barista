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
  SchematicContext,
  Rule,
  Tree,
  chain,
} from '@angular-devkit/schematics';
import { Schema } from './schema';
import { readFileFromTree, getPackageVersionFromPackageJson } from '../utils';
import { removeDependencies } from './rules/remove-dependencies';
import { addDependencies } from './rules/add-dependencies';
import { NodeDependency } from './rules/add-package-json-dependency';

export interface ExtendedSchema extends Schema {
  componentsVersion: string;
}

/** Check for angular/barista-components in package.json */
function updateOrAddImports(options: ExtendedSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [];
    const packageJSON = readFileFromTree(tree, '/package.json');

    const newDependencies: NodeDependency[] = [];
    if (packageJSON.includes('@dynatrace/angular-components')) {
      rules.push(
        removeDependencies(['@dynatrace/angular-components'], '/package.json'),
      );
    } else {
      if (options.animations) {
        // TODO: rowa check if angular is installed.
        const ngCoreVersionTag = getPackageVersionFromPackageJson(
          tree,
          '@angular/core',
        );

        newDependencies.push({
          name: '@angular/animations',
          version: ngCoreVersionTag!,
        });
      }

      newDependencies.push({
        name: '@dynatrace/barista-icons',
        version: '{{version}}',
      });
      newDependencies.push({
        name: 'd3-scale',
        version: '{{version}}',
      });
      newDependencies.push({
        name: 'd3-shape',
        version: '{{version}}',
      });
      newDependencies.push({
        name: 'd3-geo',
        version: '{{version}}',
      });
      newDependencies.push({
        name: 'highcharts',
        version: '{{version}}',
      });
    }

    newDependencies.push({
      name: '@dynatrace/barista-components',
      version: '5.0.0',
    });

    rules.push(addDependencies(newDependencies, '/package.json'));

    return chain(rules)(tree, context);
  };
}

/**
 * Schematic factory entry-point for the `ng-add` schematic. The ng-add schematic will be
 * automatically executed if developers run `ng add @dynatrace/barista-components`.
 */
export default function(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const extendedOptions: ExtendedSchema = {
      ...options,
      componentsVersion: '^5.0.0',
    };

    const rule = chain([updateOrAddImports(extendedOptions)]);

    return rule(tree, context);
  };
}
