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
  externalSchematic,
} from '@angular-devkit/schematics';
import { Schema } from './schema';
import {
  readFileFromTree,
  getPackageVersionFromPackageJson,
  readJsonAsObjectFromTree,
} from '../utils';
import { removeDependencies } from './rules/remove-dependencies';
import { addDependencies } from './rules/add-dependencies';
import { NodeDependency } from './rules/add-package-json-dependency';
import { join } from 'path';
import { updateWorkspace } from '../utils/workspace';
import { PackageJson } from '../interfaces/package-json.interface';

const ERROR_MISSING_DEPENDENCY = (dependency: string) => `
'The dependency ${dependency} is not installed in your workplace!'`;

export interface ExtendedSchema extends Schema {
  componentsVersion: string;
}

/** Check for angular/barista-components in package.json */
function updateOrAddImports(options: ExtendedSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [];
    const packageJSON = readFileFromTree(tree, '/package.json');

    const newDependencies: NodeDependency[] = [];

    // if a legacy version of the non open source version is installed
    // we have to migrate it to the @dynatrace/barista-components
    // installing the new package and refactoring all the imports
    if (packageJSON.includes('@dynatrace/angular-components')) {
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
        // if no platform browser dynamic is is installed add it to the dependencies
        if (!packageJSON.includes('@angular/platform-browser-dynamic')) {
          newDependencies.push({
            name: '@angular/platform-browser-dynamic',
            version: ngCoreVersionTag,
          });
        }
        // add animations if the user has set this flag
        newDependencies.push({
          name: '@angular/animations',
          version: ngCoreVersionTag,
        });
      }

      newDependencies.push({
        name: '@dynatrace/barista-icons',
        version: '{{version}}',
      });
      newDependencies.push({
        name: '@dynatrace/barista-fonts',
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

    // always add the new version of the barista components
    newDependencies.push({
      name: '@dynatrace/barista-components',
      version: '5.0.0',
    });

    rules.push(addDependencies(newDependencies, '/package.json'));

    if (options.project === 'myapp') {
      rules.push(
        updateWorkspace(workspace => {
          const angularApp = workspace.projects.get(options.project);

          // only if build target is specified and the angular devkit
          // build angular browser is used.
          if (
            angularApp &&
            angularApp.targets.get('build') &&
            angularApp.targets.get('build')!.builder ===
              '@angular-devkit/build-angular:browser'
          ) {
            const buildTarget = angularApp.targets.get('build')!;

            if (buildTarget.options) {
              if (buildTarget.options.styles) {
                (buildTarget.options.styles as string[]).unshift(
                  'node_modules/@dynatrace/barista-compoents...',
                );
              }

              if (buildTarget.options.assets) {
                (buildTarget.options.assets as any[]).push(
                  ...[
                    {
                      glob: '**/*',
                      input: 'node_modules/@dynatrace/barista-fonts/fonts/',
                      output: '/fonts',
                    },
                  ],
                );
              }
            }
          }
        }),
      );
    }

    return chain(rules)(tree, context);
  };
}

/** Check filesystem for imports of dynatrace/angular-components and rename then to barista-components */
export function migrateToVersion5(options: ExtendedSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [];
    const collectionPath = join(__dirname, '../../collection.json');
    // run external migration schematics
    rules.push(externalSchematic(collectionPath, 'update-5.0.0', {}));

    return chain(rules)(tree, context);
  };
}

export function getPackageVersions(tree: Tree) {
  const baristaPackage = readJsonAsObjectFromTree<PackageJson>(
    tree,
    'node_modules/@dynatrace/barista-components/package.json',
  );

  for (const peer of Object.keys(baristaPackage.peerDependencies)) {
    const version = baristaPackage.peerDependencies[peer];

    console.log(`PEER: ${peer}: ${version}`);
  }
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
