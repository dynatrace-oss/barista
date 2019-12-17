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
  noop,
} from '@angular-devkit/schematics';
import { Schema, ExtendedSchema } from './schema';
import {
  readFileFromTree,
  getPackageVersionFromPackageJson,
  readJsonAsObjectFromTree,
  findJsonPropertyInAst,
  readJsonFromTree,
} from '../utils';
import { removeDependencies } from './rules/remove-dependencies';
import { addDependencies } from './rules/add-dependencies';
import { NodeDependency } from './rules/add-package-json-dependency';
import { join } from 'path';
import { updateWorkspace } from '../utils/workspace';
import {
  PackageJson,
  PackageJsonDependency,
} from '../interfaces/package-json.interface';
import { updateWorkspaceRule } from './rules/update-workspace-rule';
import { migrateOrAddDependenciesRule } from './rules/migrate-or-add-dependencies-rule';
import { updateNgModuleRule } from './rules/update-ng-module-rule';

/**
 * Schematic factory entry-point for the `ng-add` schematic. The ng-add schematic will be
 * automatically executed if developers run `ng add @dynatrace/barista-components`.
 */
export default function(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    // Package json that we ship with all the peer dependencies and the version
    const packageJSON = readFileFromTree(tree, '/package.json');
    const baristaPackage = readJsonAsObjectFromTree<PackageJson>(
      tree,
      'node_modules/@dynatrace/barista-components/package.json',
    );

    const extendedOptions: ExtendedSchema = {
      ...options,
      componentsVersion: `^${baristaPackage.version}`,
      peerDependencies: baristaPackage.peerDependencies,
      migration: packageJSON.includes('@dynatrace/angular-components'),
    };

    const rule = chain([
      migrateOrAddDependenciesRule(extendedOptions),
      updateWorkspaceRule(extendedOptions),
      updateNgModuleRule(extendedOptions),
    ]);

    return rule(tree, context);
  };
}
