/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
import { Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { DtComponentOptions } from '../dt-component/schema';
import { findNodes, getIndentation, getSourceFile } from './ast-utils';
import { commitChanges, InsertChange } from './change';

export interface DtDemoOptions {
  name: string;
  selector: string;
}

export function addNavItem(
  host: Tree,
  options: DtComponentOptions | DtDemoOptions,
  modulePath: string,
): Tree {
  const sourceFile = getSourceFile(host, modulePath);
  const changes: InsertChange[] = [];

  const routesDeclaration = findNodes(
    sourceFile,
    ts.SyntaxKind.PropertyDeclaration,
  ).find(
    (node: ts.PropertyDeclaration) => node.name.getText() === 'navItems',
  ) as ts.PropertyDeclaration;
  const routes = (routesDeclaration.initializer as ts.ArrayLiteralExpression)
    .elements;
  const toInsert = `{ name: '${strings.capitalize(
    options.name,
  )}', route: '/${strings.dasherize(options.name)}' },`;
  let navItemBefore = routes
    .filter((node: ts.Expression) => !node.getText().includes("route: '/'"))
    .find((node: ts.Expression) => node.getText() > toInsert);

  if (!navItemBefore) {
    navItemBefore = routes[routes.length - 1];
  }

  const indentation = getIndentation([navItemBefore]);
  const end = navItemBefore.getStart();
  const routesChange = new InsertChange(
    modulePath,
    end,
    `${toInsert}${indentation}`,
  );
  changes.push(routesChange);

  return commitChanges(host, changes, modulePath);
}
