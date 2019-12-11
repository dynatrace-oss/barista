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

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export function rewriteAngularJsonImports(
  filePath: string,
  iconpack: boolean,
): Rule {
  return (tree: Tree, _: SchematicContext) => {
    const angularJson = readJsonInTree(tree, filePath);

    for (const key of Object.keys(angularJson.projects)) {
      const mainLayer = angularJson.projects[key];
      if (mainLayer.architect.build) {
        if (mainLayer.architect.build.options.assets) {
          const assets = mainLayer.architect.build.options.assets;
          for (const asset of assets) {
            for (const attr of Object.keys(asset)) {
              if (
                asset[attr].includes('angular-components') &&
                !asset[attr].includes('fonts')
              ) {
                asset[attr] = asset[attr].replace(
                  '@dynatrace/angular-components',
                  '@dynatrace/barista-components',
                );
              } else if (
                asset[attr].includes('angular-components') &&
                asset[attr].includes('fonts')
              ) {
                asset[attr] = asset[attr].replace(
                  '@dynatrace/angular-components/assets/fonts',
                  '@dynatrace/barista-fonts/fonts',
                );
                asset['output'] = '/fonts';
              }
            }
          }
          if (iconpack) {
            assets.push({
              glob: '*.svg',
              input: 'node_modules/@dynatrace/barista-icons',
              output: '/assets/icons',
            });
          }
        }
      }
    }

    tree.overwrite(filePath, JSON.stringify(angularJson, null, 2));
  };
}

function readJsonInTree<T = any>(host: Tree, path: string): T {
  const content = readFromTree(host, path);
  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error(`Cannot parse ${path}: ${e.message}`);
  }
}

function readFromTree(host: Tree, path: string): string {
  if (!host.exists(path)) {
    throw new Error(`Cannot find ${path}`);
  }
  return host.read(path)!.toString('utf-8');
}
