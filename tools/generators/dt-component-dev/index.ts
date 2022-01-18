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

import { strings } from '@angular-devkit/core';
import {
  apply,
  chain,
  mergeWith,
  Rule,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { join } from 'path';
import * as ts from 'typescript';
import { findNodes, getIndentation, getSourceFile } from '../utils/ast-utils';
import { commitChanges, InsertChange } from '../utils/change';
import { generateComponentOptions } from '../utils/schematics-utils';
import { DtComponentDevOptions } from './schema';

interface DtDevExtendedOptions {
  selector: string;
  componentModule: {
    name: string;
    package: string;
  };
  devComponent: {
    component: string;
  };
  name: string;
}

function generateDevComponentOptions(name: string): { component: string } {
  return {
    component: `${strings.classify(name)}Demo`,
  };
}

function addImport(
  sourceFile: ts.SourceFile,
  name: string,
  modulePath: string,
): InsertChange {
  const lastImport = findNodes(
    sourceFile,
    ts.SyntaxKind.ImportDeclaration,
  ).pop() as ts.ImportDeclaration;
  const end = lastImport.end + 1;
  const dashName = strings.dasherize(name);
  const classyName = strings.classify(name);
  const toInsertImport = `import { ${classyName}Demo } from './${dashName}/${dashName}-demo.component';
  `;
  return new InsertChange(modulePath, end, toInsertImport);
}

/**
 * Adds a new route inside the demos routes
 */
export function addRoute(options: DtDevExtendedOptions): Rule {
  return (host: Tree) => {
    const modulePath = join('apps', 'dev', 'src', 'devapp-routing.module.ts');
    const sourceFile = getSourceFile(host, modulePath);

    const importChange = addImport(sourceFile, options.name, modulePath);

    const routesDeclaration = findNodes(
      sourceFile,
      ts.SyntaxKind.VariableDeclaration,
    ).find(
      (node: ts.VariableDeclaration) => node.name.getText() === 'routes',
    ) as ts.VariableDeclaration;

    const routesElements = (
      routesDeclaration.initializer as ts.ArrayLiteralExpression
    ).elements;
    const lastElement = routesElements[routesElements.length - 1];
    const endRoutes = routesElements.hasTrailingComma
      ? lastElement.getEnd() + 1
      : lastElement.getEnd();

    const toInsertRoute = `${getIndentation(
      routesElements,
    )}{ path: '${strings.dasherize(
      options.name,
    )}', component: ${strings.classify(options.name)}Demo },`;
    const routeChange = new InsertChange(modulePath, endRoutes, toInsertRoute);

    return commitChanges(host, [importChange, routeChange], modulePath);
  };
}

/**
 * Adds a new navigation item into demos.
 */
export function addNavItem(options: DtDevExtendedOptions): Rule {
  return (host: Tree) => {
    const modulePath = join('apps', 'dev', 'src', 'devapp.component.ts');
    const sourceFile = getSourceFile(host, modulePath);

    const navItemDeclaration = findNodes(
      sourceFile,
      ts.SyntaxKind.PropertyDeclaration,
    ).find(
      (node: ts.PropertyDeclaration) => node.name.getText() === 'navItems',
    ) as ts.PropertyDeclaration;

    const navItems = (
      navItemDeclaration.initializer as ts.ArrayLiteralExpression
    ).elements;
    const lastNavItem = navItems[
      navItems.length - 1
    ] as ts.ObjectLiteralExpression;
    const elementsEnd = navItems.hasTrailingComma
      ? lastNavItem.getEnd() + 1
      : lastNavItem.getEnd();
    const navChange = new InsertChange(
      modulePath,
      elementsEnd,
      `${getIndentation(navItems)}{ name: '${strings.classify(
        options.name,
      )}', route: '/${strings.dasherize(options.name)}' },`,
    );

    return commitChanges(host, [navChange], modulePath);
  };
}

/**
 * Add module.
 */
export function addModule(options: DtDevExtendedOptions): Rule {
  return (host: Tree) => {
    const modulePath = join('apps', 'dev', 'src', 'app.module.ts');
    const sourceFile = getSourceFile(host, modulePath);

    const importChange = addImport(sourceFile, options.name, modulePath);

    const moduleDeclarations = findNodes(
      sourceFile,
      ts.SyntaxKind.PropertyAssignment,
    ).find(
      (node: ts.PropertyAssignment) => node.name.getText() === 'declarations',
    ) as ts.PropertyAssignment;

    const moduleDeclarationArray =
      moduleDeclarations.initializer as ts.ArrayLiteralExpression;
    const moduleElements = moduleDeclarationArray.elements;
    const lastModule = moduleElements[moduleElements.length - 1];
    const modulesEnd = moduleElements.hasTrailingComma
      ? lastModule.getEnd() + 1
      : lastModule.getEnd();
    const moduleToInsert = `${getIndentation(moduleElements)}${strings.classify(
      options.name,
    )}Demo`;

    const moduleChange = new InsertChange(
      modulePath,
      modulesEnd,
      moduleToInsert,
    );

    return commitChanges(host, [importChange, moduleChange], modulePath);
  };
}

export default function (options: DtComponentDevOptions): Rule {
  return async (_host: Tree) => {
    const extendedOptions: DtDevExtendedOptions = {
      ...options,
      selector: `dt-${strings.dasherize(options.name)}`,
      componentModule: generateComponentOptions(options.name),
      devComponent: generateDevComponentOptions(options.name),
    };

    const templateSource = apply(url('./files'), [
      template({
        ...strings,
        ...extendedOptions,
      }),
    ]);

    return chain([
      mergeWith(templateSource),
      addRoute(extendedOptions),
      addNavItem(extendedOptions),
      addModule(extendedOptions),
    ]);
  };
}
