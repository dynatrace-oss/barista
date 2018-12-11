import { Tree } from '@angular-devkit/schematics';
import { getSourceFile, findNodes, getIndentation } from './ast-utils';
import { InsertChange, commitChanges } from './change';
import { strings } from '@angular-devkit/core';
import * as ts from 'typescript';
import { DtComponentOptions } from '../dt-component/schema';
import { DtDemoOptions } from '../dt-demo/schema';

export function addNavItem(host: Tree, options: DtComponentOptions | DtDemoOptions, modulePath: string): Tree {
  const sourceFile = getSourceFile(host, modulePath);
  const changes: InsertChange[] = [];

  const routesDeclaration = findNodes(sourceFile, ts.SyntaxKind.PropertyDeclaration)
  .find((node: ts.PropertyDeclaration) => node.name.getText() === 'navItems') as ts.PropertyDeclaration;
  const routes = (routesDeclaration.initializer as ts.ArrayLiteralExpression).elements;
  const toInsert = `{ name: '${strings.capitalize(options.name)}', route: '/${strings.dasherize(options.name)}' },`;
  let navItemBefore = routes
    .filter((node: ts.Expression) => !node.getText().includes('route: \'/\''))
    .find((node: ts.Expression) => node.getText() > toInsert);

  if (!navItemBefore) {
    navItemBefore = routes[routes.length - 1];
  }

  const indentation = getIndentation([navItemBefore]);
  const end = navItemBefore.getStart();
  const routesChange = new InsertChange(modulePath, end, `${toInsert}${indentation}`);
  changes.push(routesChange);

  return commitChanges(host, changes, modulePath);
}
