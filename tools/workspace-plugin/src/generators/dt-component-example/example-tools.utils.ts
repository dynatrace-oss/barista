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

import { Rule, Tree } from '@angular-devkit/schematics';
import { join } from 'path';
import { getSourceFile, addImport, findNodes } from '../utils/ast-utils';
import { commitChanges, InsertChange } from '../utils/change';
import * as ts from 'typescript';
import { DtExampleExtendedOptions } from './index';

/**
 * Update the examples tool module file.
 * @param options
 */
export function updateExamplesModule(options: DtExampleExtendedOptions): Rule {
  return (host: Tree) => {
    try {
      const path = join('libs', 'examples', 'src', 'examples.module.ts');
      const sourceFile = getSourceFile(host, path);

      const importChange = addImport(
        sourceFile,
        options.examplesModule,
        `${options.dashName}/${options.dashName}-examples.module`,
        path,
      );

      const modulesDeclaration = findNodes(
        sourceFile,
        ts.SyntaxKind.PropertyAssignment,
      ).find(
        (node: ts.PropertyAssignment) => node.name.getText() === 'imports',
      ) as ts.PropertyAssignment;
      const modulesElements = (
        modulesDeclaration.initializer as ts.ArrayLiteralExpression
      ).elements;
      const lastElement = modulesElements[modulesElements.length - 1];
      const end = modulesElements.hasTrailingComma
        ? lastElement.getEnd() + 1
        : lastElement.getEnd();
      const modulesChange = new InsertChange(
        path,
        end,
        `${modulesElements.hasTrailingComma ? ' ' : ', '}${
          options.examplesModule
        }`,
      );

      return commitChanges(host, [importChange, modulesChange], path);
    } catch (error) {
      throw new Error(
        `There was a problem modifying 'libs/examples/src/examples.module.ts': ${error.message}`,
      );
    }
  };
}

/**
 * Implement changes to app routing module (apps/demos/src/app-routing.module.ts)
 * @param options
 */
export function changeRoutingModule(options: DtExampleExtendedOptions): Rule {
  return (host: Tree) => {
    try {
      const path = join('apps', 'demos', 'src', 'app-routing.module.ts');
      const sourceFile = getSourceFile(host, path);

      // add import
      const lastImport = findNodes(
        sourceFile,
        ts.SyntaxKind.ImportDeclaration,
      ).pop() as ts.ImportDeclaration;
      const namedImports = (lastImport.importClause as ts.ImportClause)
        .namedBindings as ts.NamedImports;
      const importElements =
        namedImports.elements as ts.NodeArray<ts.ImportSpecifier>;
      const lastImportElement = importElements[importElements.length - 1];
      const end = lastImportElement.end + 1;
      const toInsertImport = `${options.exampleComponent.component},
  `;
      const importChange = new InsertChange(path, end, toInsertImport);

      // add path
      const pathsVariables = findNodes(
        sourceFile,
        ts.SyntaxKind.VariableDeclaration,
      ).find(
        (declaration) =>
          (declaration as ts.VariableDeclaration).name.getText() === 'ROUTES',
      );
      const paths = (
        (pathsVariables as ts.VariableDeclaration)
          .initializer as ts.ArrayLiteralExpression
      ).elements;
      const lastPath = paths[paths.length - 1];
      const toInsertPath = `{ path: '${options.exampleId}-example', component: ${options.exampleComponent.component} },`;
      const pathChange = new InsertChange(path, lastPath.end + 1, toInsertPath); // +1 is because of the comma at the end

      return commitChanges(host, [importChange, pathChange], path);
    } catch (error) {
      throw new Error(
        `There was a problem modifying 'app-routing.module.ts': ${error.message}`,
      );
    }
  };
}

/**
 * Implement changes to the navigation (apps/demos/src/nav-items.ts)
 * @param options
 * @param isNewComponent
 */
export function changeNavigation(
  options: DtExampleExtendedOptions,
  isNewComponent: boolean,
): Rule {
  return (host: Tree) => {
    try {
      const path = join('apps', 'demos', 'src', 'nav-items.ts');
      const sourceFile = getSourceFile(host, path);

      // finding the navigation elements
      const navigationObject = findNodes(
        sourceFile,
        ts.SyntaxKind.VariableDeclaration,
      ).find(
        (declaration) =>
          (declaration as ts.VariableDeclaration).name.getText() ===
          'DT_DEMOS_EXAMPLE_NAV_ITEMS',
      );
      const navElements = (
        (navigationObject as ts.VariableDeclaration)
          .initializer as ts.ArrayLiteralExpression
      ).elements;

      let change;
      const exampleString = `${options.exampleId}-example`;

      if (isNewComponent) {
        const navElementsArray =
          navElements as ts.NodeArray<ts.ObjectLiteralExpression>;
        const lastNavElement = navElementsArray[navElementsArray.length - 1];

        const componentExampleString = `,
      {
       "name": "${options.dashName}",
       "examples": [
         {
           "name": "${exampleString}",
           "route": "/${exampleString}"
         }
       ]
     }`;

        change = new InsertChange(
          path,
          lastNavElement.end,
          componentExampleString,
        );
      } else {
        const componentNavElement = (
          navElements as ts.NodeArray<ts.ObjectLiteralExpression>
        ).find((element) =>
          (element.properties as ts.NodeArray<ts.PropertyAssignment>).find(
            (assignment) =>
              (assignment.initializer as ts.StringLiteral).getText() ===
              `'${options.dashName}'`,
          ),
        );

        // get example assignment
        const exampleAssignment = (
          componentNavElement!.properties as ts.NodeArray<ts.PropertyAssignment>
        ).find((assignment) => assignment.name.getText() === 'examples');

        const exampleAssignmentArray = (
          exampleAssignment!.initializer as ts.ArrayLiteralExpression
        ).elements;
        const lastExampleAssignment =
          exampleAssignmentArray[exampleAssignmentArray.length - 1];

        change = new InsertChange(
          path,
          lastExampleAssignment.end,
          `,
    {
      "name": "${exampleString}",
      "route": "/${exampleString}"
    }`,
        );
      }
      return commitChanges(host, change, path);
    } catch (error) {
      throw new Error(
        `There was a problem updating 'apps/demos/src/nav-items.ts' : ${error.message}`,
      );
    }
  };
}

/**
 * Updates the examples barrel file: libs/examples/src/index.ts
 * @param options
 * @param isNewComponent
 */
export function updateExamplesBarrel(
  options: DtExampleExtendedOptions,
  isNewComponent: boolean,
): Rule {
  return (host: Tree) => {
    try {
      const path = join('libs', 'examples', 'src', 'index.ts');
      const sourceFile = getSourceFile(host, path);

      // add import to barrel file
      const importChange = addImport(
        sourceFile,
        options.exampleComponent.component,
        `./${options.dashName}/${options.exampleRoute}`,
        path,
      );

      const exports = findNodes(sourceFile, ts.SyntaxKind.ExportDeclaration);

      // module export
      let exportModuleChange;
      if (isNewComponent) {
        const exportPath = `./${options.dashName}/${options.dashName}-examples.module`;
        // We need the export before the last export, and add a new export after that.
        const beforeLastExport = exports[
          exports.length - 2
        ] as ts.ExportDeclaration;
        const end = beforeLastExport.end + 1;
        const toInsertExport = `export { ${options.examplesModule} } from '${exportPath}';
      `;
        exportModuleChange = new InsertChange(path, end, toInsertExport);
      }

      // add export without path
      const lastExport = exports.pop() as ts.ExportDeclaration;
      const elements = (lastExport.exportClause as ts.NamedExports)
        .elements as ts.NodeArray<ts.ExportSpecifier>;
      const lastElement = elements[elements.length - 1];
      const endOfExports = lastElement.getEnd() + 1; // +1 because of the comma
      const toInsertExportSpecifier = `${options.exampleComponent.component},`;
      const exportSpecifierChange = new InsertChange(
        path,
        endOfExports,
        toInsertExportSpecifier,
      );

      // extend examples map
      const exampleMap = findNodes(
        sourceFile,
        ts.SyntaxKind.VariableDeclaration,
      )
        .filter(
          (declaration) =>
            (declaration as ts.VariableDeclaration).name.getText() ===
            'EXAMPLES_MAP',
        )
        .pop();
      const mapArray = (
        (exampleMap as ts.VariableDeclaration).initializer as ts.NewExpression
      ).arguments![0] as ts.ArrayLiteralExpression;
      const mapArrayElements = mapArray.elements;
      const lastArrayElement = mapArrayElements[mapArrayElements.length - 1];
      const mapEnd = mapArrayElements.hasTrailingComma
        ? lastArrayElement.end + 1
        : lastArrayElement.end;
      const examplesMapChanges = new InsertChange(
        path,
        mapEnd,
        `
['${options.exampleComponent.component}', ${options.exampleComponent.component}],`,
      );

      let changes = [importChange, exportSpecifierChange, examplesMapChanges];
      if (isNewComponent) {
        changes.push(exportModuleChange);
      }

      return commitChanges(host, changes, path);
    } catch (error) {
      throw new Error(
        `There was a problem modifying 'libs/examples/src/index.ts: ${error.message}`,
      );
    }
  };
}
