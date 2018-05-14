import {
  chain,
  mergeWith,
  Tree,
  apply,
  filter,
  move,
  Rule,
  template,
  url,
  branchAndMerge,
  noop,
  source,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { DtComponentOptions } from './schema';
import { getSourceFile, getSourceNodes, findNodes, getIndentation, addImport, addDynatraceAngularComponentsImport } from '../utils/ast-utils';
import * as path from 'path';
import * as ts from 'typescript';
import { InsertChange, commitChanges } from '../utils/change';

/**
 * Adds the export to the index in the lib root
 */
function addExportToRootIndex(options: DtComponentOptions): Rule {
  return (host: Tree) => {
    const modulePath = path.join('src', 'lib', 'index.ts');
    const rootPublicApi = getSourceFile(host, modulePath);
    const rootPublicApiNodes = getSourceNodes(rootPublicApi);
    let lastExportPos = 0;
    rootPublicApiNodes.forEach((node) => {
      if (node.kind === ts.SyntaxKind.ExportDeclaration) {
        lastExportPos = node.getEnd() + 1;
      }
    });
    const toInsert = `export * from './${options.name}/index';\n`;
    const changes = [new InsertChange(modulePath, lastExportPos, toInsert)];
    return commitChanges(host, changes, modulePath);
  };
}

/**
 * Adds the declarations for the lib module inside the docs-module
 */
function addDeclarationsToDocsModule(options: DtComponentOptions): Rule {
  return (host: Tree) => {
    const modulePath = path.join('src', 'docs', 'docs.module.ts');
    const sourceFile = getSourceFile(host, modulePath);
    const importName = `Docs${strings.classify(options.name)}Module`;
    const importLocation = `'./components/${strings.dasherize(options.name)}/docs-${strings.dasherize(options.name)}.module';`;
    const importChange = addImport(modulePath, sourceFile, importName, importLocation);
    /**
     * add it to the imports declaration in the module
     */
    const assignments = findNodes(sourceFile, ts.SyntaxKind.PropertyAssignment);
    const assignment = assignments[0] as ts.PropertyAssignment;
    const arrLiteral = assignment.initializer as ts.ArrayLiteralExpression;
    const importElements = arrLiteral.elements;
    const end = arrLiteral.elements.end;

    const indentation = getIndentation(importElements);
    const toInsert = `${indentation}Docs${strings.classify(options.name)}Module,`;
    const importsChange = new InsertChange(modulePath, end, toInsert);

    const changes = [importChange, importsChange];
    return commitChanges(host, changes, modulePath);
  };
}

/**
 * Adds a new route inside the docs routes
 */
function addRouteInDocs(options: DtComponentOptions): Rule {
  return (host: Tree) => {
    const modulePath = path.join('src', 'docs', 'docs-routing.module.ts');
    const sourceFile = getSourceFile(host, modulePath);

    const importName = `Docs${strings.classify(options.name)}Component`;
    const importLocation = `'./components/${strings.dasherize(options.name)}/docs-${strings.dasherize(options.name)}.component';`;
    const importChange = addImport(modulePath, sourceFile, importName, importLocation);
    const changes = [importChange];

    /**
     * find first routes property assignment
     */
    const routesDeclaration = findNodes(sourceFile, ts.SyntaxKind.VariableDeclaration)
    .find((node: ts.VariableDeclaration) => node.name.getText() === 'routes') as ts.VariableDeclaration;
    const routes = (routesDeclaration.initializer as ts.ArrayLiteralExpression).elements;
    const wildcardroute = routes.filter((node: ts.Expression) => node.getText().includes('path: \'**\''));

    if (wildcardroute.length > 0) {
      const indentation = getIndentation(wildcardroute);
      const toInsert = `{ path: '${strings.dasherize(options.name)}', component: ${importName} },${indentation}`;
      const end = (wildcardroute.pop() as ts.Expression).getStart();
      const routesChange = new InsertChange(modulePath, end, toInsert);
      changes.push(routesChange);
    }

    return commitChanges(host, changes, modulePath);
  };
}

/**
 * Adds a new navitem inside the docs navitems
 */
function addNavitemInDocs(options: DtComponentOptions): Rule {
  return (host: Tree) => {
    const modulePath = path.join('src', 'docs', 'docs.component.ts');
    const sourceFile = getSourceFile(host, modulePath);
    const changes: InsertChange[] = [];

    const routesDeclaration = findNodes(sourceFile, ts.SyntaxKind.PropertyDeclaration)
    .find((node: ts.PropertyDeclaration) => node.name.getText() === 'navItems') as ts.PropertyDeclaration;
    const routes = (routesDeclaration.initializer as ts.ArrayLiteralExpression).elements;
    const toInsert = `{name: '${strings.capitalize(options.name)}', route: '/${strings.dasherize(options.name)}'},`;
    const navItemBefore = routes
      .filter((node: ts.Expression) => !node.getText().includes('route: \'/\''))
      .find((node: ts.Expression) => node.getText() > toInsert);

    if (navItemBefore) {
      const indentation = getIndentation([navItemBefore]);
      const end = navItemBefore.getStart();
      const routesChange = new InsertChange(modulePath, end, `${toInsert}${indentation}`);
      changes.push(routesChange);
    }

    return commitChanges(host, changes, modulePath);
  };
}

/** Adds import and declaration to universal */
function addDeclarationsToKitchenSink(options: DtComponentOptions): Rule {
  return (host: Tree) => {
    const sourceFilePath = path.join('src', 'universal-app', 'kitchen-sink', 'kitchen-sink.ts');
    const sourceFile = getSourceFile(host, sourceFilePath);
    const moduleName = `Dt${strings.classify(options.name)}Module`;

    const importChange = addDynatraceAngularComponentsImport(
      sourceFile,
      sourceFilePath,
      moduleName
    );
    const changes = [importChange];

    /**
     * add it to the imports declaration in the module
     */
    const assignments = findNodes(sourceFile, ts.SyntaxKind.PropertyAssignment);
    const importSyntaxLists = assignments
      .filter((c) => c.getText().startsWith('imports')) // filter imports
      .map((c) => c.getChildren())
      .reduce((acc, val) => acc.concat(val), []) // flatten
      .filter((c) => c.kind === ts.SyntaxKind.ArrayLiteralExpression) // filter out arrays
      .filter((c) => c.getText().match(/Dt\w*?Module/)) // filter the one with other Dt***Module declarations
      .map((c) => c.getChildren())
      .reduce((acc, val) => acc.concat(val), []) // flatten
      .filter((c) => c.kind === ts.SyntaxKind.SyntaxList) as ts.SyntaxList[]; // remove tokens

    const indentation = getIndentation(importSyntaxLists);
    const toInsert = `${indentation}${moduleName},`;
    const importsChange = new InsertChange(sourceFilePath, importSyntaxLists[0].end, toInsert);
    changes.push(importsChange);
    return commitChanges(host, changes, sourceFilePath);
  };
}

/** Adds selector to html */
function addCompToKitchenSink(options: DtComponentOptions): Rule {
  return (tree: Tree) => {
    const filePath = path.join('src', 'universal-app', 'kitchen-sink', 'kitchen-sink.html');
    const content = tree.read(filePath);
    if (!content) {
      return;
    }
    const selector = `dt-${strings.dasherize(options.name)}`;
    // Prevent from adding the same component again.
    if (content.indexOf(selector) === -1) {
      tree.overwrite(filePath, `${content}\n<${selector}></${selector}>`);
    }
    return tree;
  };
}

export default function(options: DtComponentOptions): Rule {
  options.symbolName = `Dt${strings.classify(options.name)}Module`;
  const templateSource = apply(url('./files'), [
      options.uitest ? noop() : filter((path) => !path.startsWith('/ui-test-app')),
      template({
        ...strings,
        ...options,
      }),
      move('src'),
    ]);

  return chain([
    mergeWith(templateSource),
    addExportToRootIndex(options),
    addDeclarationsToDocsModule(options),
    addRouteInDocs(options),
    addNavitemInDocs(options),
    options.universal ? chain([addDeclarationsToKitchenSink(options), addCompToKitchenSink(options)]) : noop(),
  ]);
}
