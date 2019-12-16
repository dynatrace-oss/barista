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

import { chain, Rule, SchematicContext } from '@angular-devkit/schematics';
import { Tree } from '@angular-devkit/schematics/src/tree/interface';
import { join } from 'path';
import { updateWorkspace } from '../../utils/workspace';
import { ExtendedSchema } from '../schema';

const ORGANIZATION_PACKAGE_PATH = 'node_modules/@dynatrace';
const PACKAGE_NODE_MODULES_PATH = join(
  ORGANIZATION_PACKAGE_PATH,
  'barista-components',
);
const BARISTA_FONTS_PACKAGE_PATH = join(
  ORGANIZATION_PACKAGE_PATH,
  'barista-fonts',
);

/**
 * The updateWorkspaceRule modifies the `angular.json` to add all necessary
 * styles and assets to the specified project
 */
export function updateWorkspaceRule(options: ExtendedSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [];

    if (options.project) {
      rules.push(
        updateWorkspace(workspace => {
          const angularApp = workspace.projects.get(options.project);

          // only if build target is specified and the angular dev-kit
          // build angular browser is used.
          if (
            angularApp &&
            angularApp.targets.get('build') &&
            angularApp.targets.get('build')!.builder ===
              '@angular-devkit/build-angular:browser'
          ) {
            const buildTarget = angularApp.targets.get('build')!;

            if (buildTarget.options) {
              const styleBundle = options.typography
                ? 'index.scss'
                : 'main.scss';

              const componentStyles = join(
                PACKAGE_NODE_MODULES_PATH,
                'style',
                styleBundle,
              );

              const styleRessources = [
                componentStyles,
                join(BARISTA_FONTS_PACKAGE_PATH, 'typography.scss'),
              ];

              if (buildTarget.options.styles) {
                (buildTarget.options.styles as string[]).unshift(
                  ...styleRessources,
                );
              } else {
                buildTarget.options.styles = styleRessources;
              }

              if (buildTarget.options.assets) {
                (buildTarget.options.assets as any[]).push(
                  ...[
                    {
                      glob: '**/*',
                      input: join(BARISTA_FONTS_PACKAGE_PATH, 'fonts/'),
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
