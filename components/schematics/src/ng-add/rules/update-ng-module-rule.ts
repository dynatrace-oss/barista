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
import { updateWorkspace, getWorkspace } from '../../utils/workspace';
import { ExtendedSchema } from '../schema';
import {
  readFileFromTree,
  updateNgModuleDecoratorProperties,
  createPropertyAssignment,
  NgModuleProperties,
  addImportToSourceFile,
  printNode,
  createStringLiteral,
} from '../../utils';
import * as ts from 'typescript';

const NO_VALID_PROJECT_ERROR =
  'The specified project is not a valid angular project with a main entry file!';

/**
 * The updateWorkspaceRule modifies the `angular.json` to add all necessary
 * styles and assets to the specified project
 */
export function updateNgModuleRule(options: ExtendedSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    // TODO: lukas.holzer check later on when no module is provided resolve it via the
    // workspace with the provided build target. project.architect.build.options.main
    // in the main file the module should be bootstrapped.

    if (!options.module || options.migration) {
      return;
    }

    const moduleSource = readFileFromTree(tree, options.module);

    const appModuleSourceFile = ts.createSourceFile(
      options.module,
      moduleSource,
      ts.ScriptTarget.Latest,
      true,
    );

    const iconModuleForRoot = ts.createCall(
      ts.createPropertyAccess(
        ts.createIdentifier('DtIconModule'),
        ts.createIdentifier('forRoot'),
      ),
      undefined,
      [
        ts.createObjectLiteral([
          createPropertyAssignment(
            'svgIconLocation',
            createStringLiteral('/assets/icons/{{name}}.svg', true),
          ),
        ]),
      ],
    );

    // Add the DtIconModule.forRoot
    const changes = [
      sourceFile =>
        updateNgModuleDecoratorProperties(
          sourceFile,
          NgModuleProperties.Imports,
          iconModuleForRoot,
        ),
      sourceFile =>
        addImportToSourceFile(
          sourceFile,
          ['DtIconModule'],
          '@dynatrace/barista-components/icon',
        ),
    ];

    if (options.animations) {
      // update of ngModule should be done before adding imports
      changes.unshift(sourceFile =>
        updateNgModuleDecoratorProperties(
          sourceFile,
          NgModuleProperties.Imports,
          ts.createIdentifier('BrowserAnimationsModule'),
        ),
      );
      changes.push(sourceFile =>
        addImportToSourceFile(
          sourceFile,
          ['BrowserAnimationsModule'],
          '@angular/platform-browser/animations',
        ),
      );
    }

    const modifiedSourceFile = modifySourceFile(appModuleSourceFile, changes);

    tree.overwrite(options.module, printNode(modifiedSourceFile));
  };
}

function modifySourceFile(
  sourceFile: ts.SourceFile,
  modifiers: Array<(source: ts.SourceFile) => ts.SourceFile>,
): ts.SourceFile {
  let prevSourceFile = sourceFile;

  for (const modifier of modifiers) {
    prevSourceFile = modifier(prevSourceFile);
  }

  return prevSourceFile;
}
