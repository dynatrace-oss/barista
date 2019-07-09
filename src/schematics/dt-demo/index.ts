import { strings } from '@angular-devkit/core';
import {
  Rule,
  Tree,
  apply,
  chain,
  mergeWith,
  move,
  template,
  url,
} from '@angular-devkit/schematics';
import * as path from 'path';
import * as ts from 'typescript';
import {
  addImport,
  findNodes,
  getIndentation,
  getSourceFile,
  addNavitemToDevApp,
  addDeclarationsToDevAppModule,
} from '../utils/ast-utils';
import { InsertChange, commitChanges } from '../utils/change';
import { DtDemoOptions } from './schema';

/**
 * Adds a new route inside the ui-test routes
 */
function addRoute(options: DtDemoOptions): Rule {
  return (host: Tree) => {
    const modulePath = path.join('src', 'dev-app', 'devapp-routing.module.ts');
    const sourceFile = getSourceFile(host, modulePath);

    const importName = `${strings.classify(options.name)}Demo`;
    const importLocation = `'./${options.name}/${options.name}-demo.component';`;
    const importChange = addImport(
      modulePath,
      sourceFile,
      importName,
      importLocation
    );

    /**
     * find last route and add new route
     */
    const routesDeclaration = findNodes(
      sourceFile,
      ts.SyntaxKind.VariableDeclaration
    ).find(
      (node: ts.VariableDeclaration) => node.name.getText() === 'routes'
    ) as ts.VariableDeclaration;
    const routes = (routesDeclaration.initializer as ts.ArrayLiteralExpression)
      .elements;
    const end = routes[routes.length - 1].getStart();
    const indentation = getIndentation(routes);
    const toInsert = `{ path: '${options.name}', component: ${importName} },${indentation}`;
    const routesChange = new InsertChange(modulePath, end, toInsert);

    return commitChanges(host, [importChange, routesChange], modulePath);
  };
}

// tslint:disable-next-line:no-default-export
export default function(options: DtDemoOptions): Rule {
  const templateSource = apply(url('./files'), [
    template({
      ...strings,
      ...options,
    }),
    move('src/dev-app'),
  ]);

  return chain([
    mergeWith(templateSource),
    addDeclarationsToDevAppModule(options.name),
    addRoute(options),
    addNavitemToDevApp(options.name),
  ]);
}
