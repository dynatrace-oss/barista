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
  SchematicContext,
  Rule,
  Tree,
  chain,
} from '@angular-devkit/schematics';
import { Schema, ExtendedSchema } from './schema';
import {
  readFileFromTree,
  readJsonFromTree,
  installPackagesRule,
} from '../utils';
import { PackageJson } from '../interfaces/package-json.interface';
import {
  updateWorkspaceRule,
  migrateOrAddDependenciesRule,
  updateNgModuleRule,
} from './rules';

/**
 * Schematic factory entry-point for the `ng-add` schematic. The ng-add schematic will be
 * automatically executed if developers run `ng add @dynatrace/barista-components`.
 */
export default function (options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    // Package json that we ship with all the peer dependencies and the version
    const packageJSON = readFileFromTree(tree, '/package.json');
    const baristaPackage = readJsonFromTree<PackageJson>(
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
      installPackagesRule(extendedOptions),
    ]);

    return rule(tree, context);
  };
}
