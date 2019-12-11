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
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { join } from 'path';
import { Schema } from './schema';
import {
  createPackageTree,
  createMultipleImportsTree,
  createAngularJsonTree,
  createPeerDependenciesTree,
  createAppModuleTree,
  createStyleCssTree,
  styleCss,
  ANGULARJSON,
  APPMODULE,
  PACKAGEJSON,
  PEERDEPENDENCIES,
  RENAMEDIMPORT,
} from './testing-constants';

const collectionPath = join(__dirname, '../collection.json');

const testRunner = new SchematicTestRunner('schematics', collectionPath);

const schematicOptions: Schema = {
  isTestEnv: true,
  angularPathRefactor: true,
  animations: true,
  iconpack: true,
  stylesPack: true,
};

/**
 * Schematic helper function for starting ng-add schematic
 * @param schematicName Name of the schematic
 * @param options Options concerning the ng-add schematic
 * @param tree host tree
 */
export async function runSchematic(
  schematicName: string,
  options: any,
  t: Tree,
): Promise<UnitTestTree> {
  return testRunner.runSchematicAsync(schematicName, options, t).toPromise();
}

/**
 * Retrieve content of certain path in host tree
 * @param tree The tree from host
 * @param path The path to file
 */
export function getFileContent(t: Tree, path: string): string {
  const fileEntry = t.get(path);

  if (!fileEntry) {
    throw new Error(`The file (${path}) does not exist.`);
  }

  return fileEntry.content.toString();
}

let tree: Tree;
// Testing of Dynatrace Ng-Add Schematic
describe('ng-add schematic for dynatrace barista-components', () => {
  describe('Updating imports from @dynatrace/angular-components to @dynatrace/barista-components.', () => {
    beforeAll(async () => {
      tree = Tree.empty();
      createPackageTree(tree);
      createMultipleImportsTree(tree);
      createAngularJsonTree(tree);
      createPeerDependenciesTree(tree);
      createAppModuleTree(tree);
      createStyleCssTree(tree);

      await runSchematic('ng-add', schematicOptions, tree);
    });

    it('should update imports in package.json', () => {
      expect(getFileContent(tree, '/package.json')).toEqual(PACKAGEJSON);
    });

    it('should update peerDependecies', () => {
      expect(getFileContent(tree, 'components/src/peerPackage.json')).toEqual(
        PEERDEPENDENCIES,
      );
    });

    it('should update imports in project', () => {
      expect(getFileContent(tree, 'apps/src/main.ts')).toEqual(RENAMEDIMPORT);
    });

    it('should install @angular/animations', () => {
      expect(getFileContent(tree, 'app.module.ts')).toEqual(APPMODULE);
    });

    it('should insert styles to main css file', () => {
      expect(getFileContent(tree, 'index.css')).toEqual(styleCss);
    });

    it('should update icons and fonts paths in angular.json', () => {
      expect(getFileContent(tree, 'angular.json')).toEqual(ANGULARJSON);
    });
  });
});
