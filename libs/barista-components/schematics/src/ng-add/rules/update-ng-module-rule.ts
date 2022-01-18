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

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import {
  addImportToSourceFile,
  createPropertyAssignment,
  createStringLiteral,
  NgModuleProperties,
  printNode,
  readFileFromTree,
  updateNgModuleDecoratorProperties,
} from '../../utils';
import { ExtendedSchema } from '../schema';

/** The updateNgModuleRule modifies the app module */
export function updateNgModuleRule(options: ExtendedSchema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
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

    const iconModuleForRoot = ts.factory.createCallExpression(
      ts.factory.createPropertyAccessExpression(
        ts.factory.createIdentifier('DtIconModule'),
        ts.factory.createIdentifier('forRoot'),
      ),
      undefined,
      [
        ts.factory.createObjectLiteralExpression([
          createPropertyAssignment(
            'svgIconLocation',
            createStringLiteral('/assets/icons/{{name}}.svg', true),
          ),
        ]),
      ],
    );

    // Add the DtIconModule.forRoot and add the HttpClientModule
    const changes = [
      (sourceFile) =>
        updateNgModuleDecoratorProperties(
          sourceFile,
          NgModuleProperties.Imports,
          iconModuleForRoot,
        ),
      (sourceFile) =>
        updateNgModuleDecoratorProperties(
          sourceFile,
          NgModuleProperties.Imports,
          ts.factory.createIdentifier('HttpClientModule'),
        ),
      (sourceFile) =>
        addImportToSourceFile(
          sourceFile,
          ['HttpClientModule'],
          '@angular/common/http',
        ),
      (sourceFile) =>
        addImportToSourceFile(
          sourceFile,
          ['DtIconModule'],
          '@dynatrace/barista-components/icon',
        ),
    ];

    // when the user doesn't want any animations add the NoopAnimationsModule
    const animationModule = options.animations
      ? 'BrowserAnimationsModule'
      : 'NoopAnimationsModule';

    // update of ngModule should be done before adding imports
    changes.unshift((sourceFile) =>
      updateNgModuleDecoratorProperties(
        sourceFile,
        NgModuleProperties.Imports,
        ts.factory.createIdentifier(animationModule),
      ),
    );
    changes.push((sourceFile) =>
      addImportToSourceFile(
        sourceFile,
        [animationModule],
        '@angular/platform-browser/animations',
      ),
    );

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
