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
  AssetPattern,
  Schema as BuildAngularSchema,
  // Schema.json is only importable via the src files
} from '@angular-devkit/build-angular/src/browser/schema';
import {
  chain,
  Rule,
  SchematicContext,
  Tree,
  SchematicsException,
} from '@angular-devkit/schematics';
import { join } from 'path';
import { updateWorkspace } from '../../utils/workspace';
import { ExtendedSchema } from '../schema';
import { workspaces } from '@angular-devkit/core';

const ORGANIZATION_PACKAGE_PATH = 'node_modules/@dynatrace';
const PACKAGE_NODE_MODULES_PATH = join(
  ORGANIZATION_PACKAGE_PATH,
  'barista-components',
);
const BARISTA_FONTS_PACKAGE_PATH = join(
  ORGANIZATION_PACKAGE_PATH,
  'barista-fonts',
);
const BARISTA_ICONS_PACKAGE_PATH = join(
  ORGANIZATION_PACKAGE_PATH,
  'barista-icons',
);

export const COULD_NOT_FIND_PROJECT_ERROR = (projectName: string) =>
  `Could not find project in workspace: ${projectName}`;

export const COULD_NOT_FIND_DEFAULT_PROJECT_ERROR =
  `Could not find default project to add the barista components.\n` +
  `You can add it with "ng add @dynatrace/barista-components your-project".`;

function getProject(
  workspace: workspaces.WorkspaceDefinition,
  projectName?: string,
): workspaces.ProjectDefinition {
  const defaultProject = workspace.extensions['defaultProject'] as string;
  const project = workspace.projects.get(projectName || defaultProject);

  if (!project && !defaultProject) {
    throw new SchematicsException(COULD_NOT_FIND_DEFAULT_PROJECT_ERROR);
  }

  if (!project) {
    throw new SchematicsException(COULD_NOT_FIND_PROJECT_ERROR(projectName!));
  }

  return project;
}

/**
 * The updateWorkspaceRule modifies the `angular.json` to add all necessary
 * styles and assets to the specified project
 */
export function updateWorkspaceRule(options: ExtendedSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const rules: Rule[] = [];

    rules.push(
      updateWorkspace((workspace) => {
        const angularApp = getProject(workspace, options.project);

        // only if build target is specified and the angular dev-kit
        // build angular browser is used.
        if (
          angularApp &&
          angularApp.targets.get('build') &&
          angularApp.targets.get('build')!.builder ===
            '@angular-devkit/build-angular:browser'
        ) {
          const buildTarget = angularApp.targets.get('build');

          if (buildTarget && buildTarget.options) {
            const builderOptions =
              buildTarget.options as unknown as BuildAngularSchema;

            // include the index for styles with typography (headlines, text-styles...)
            // or the main for only the component base styles
            const styleBundle = options.typography ? 'index.scss' : 'main.scss';

            const styleResources = [
              // font face definitions for the barista font
              join(BARISTA_FONTS_PACKAGE_PATH, 'typography.scss'),
            ];

            if (!options.migration) {
              // base component styles or with extended typography
              styleResources.push(
                join(PACKAGE_NODE_MODULES_PATH, 'style', styleBundle),
              );
            }

            // Add all the necessary styles to the application
            if (builderOptions.styles) {
              builderOptions.styles.unshift(...styleResources);
            } else {
              builderOptions.styles = styleResources;
            }

            // Store all paths that need to be added to the assets
            const libraryAssetStringPaths: string[] = [];
            const libraryAssets: AssetPattern[] = [
              {
                glob: '**/*',
                input: join(BARISTA_FONTS_PACKAGE_PATH, 'fonts/'),
                output: '/fonts',
              },
            ];

            // Add the barista font package to the application
            if (builderOptions.assets) {
              // if no dt-iconpack added previously we add the barista
              // icons. Otherwise we adjust the input path.
              if (
                !JSON.stringify(builderOptions.assets).includes(
                  '@dynatrace/dt-iconpack',
                )
              ) {
                libraryAssets.push(
                  ...[
                    {
                      glob: 'metadata.json',
                      input: BARISTA_ICONS_PACKAGE_PATH,
                      output: '/assets/icons',
                    },
                    {
                      glob: '*.svg',
                      input: BARISTA_ICONS_PACKAGE_PATH,
                      output: '/assets/icons',
                    },
                  ],
                );
              }

              for (const asset of builderOptions.assets) {
                // store the string path assets in a different array to preserve sorting
                if (typeof asset === 'string') {
                  libraryAssetStringPaths.push(asset);
                  continue;
                }

                // replace iconpack in path with barista-icons
                if (
                  typeof asset === 'object' &&
                  asset.input.includes('@dynatrace/dt-iconpack')
                ) {
                  libraryAssets.push({
                    ...asset,
                    input: asset.input.replace('dt-iconpack', 'barista-icons'),
                  });
                  continue;
                }

                // change angular components in paths with barsita components
                if (
                  typeof asset === 'object' &&
                  asset.input.includes('@dynatrace/angular-components')
                ) {
                  libraryAssets.push({
                    ...asset,
                    input: asset.input.replace(
                      'angular-components',
                      'barista-components',
                    ),
                  });
                  continue;
                }

                // other objects just push to libraryAssets
                libraryAssets.push(asset);
              }
            }

            builderOptions.assets = [
              ...libraryAssetStringPaths,
              ...libraryAssets,
            ];
          }
        }
      }),
    );

    return chain(rules)(tree, context);
  };
}
