import { strings } from '@angular-devkit/core';
import {
  Rule,
  Tree,
  apply,
  chain,
  filter,
  mergeWith,
  move,
  noop,
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
  getSourceNodes,
  addToNgModule,
  addDynatraceSubPackageImport,
} from '../utils/ast-utils';
import { InsertChange, commitChanges } from '../utils/change';
import { addNavItem } from '../utils/nav-items';
import { DtComponentOptions } from './schema';

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
  return (host: Tree) => addNavItem(host, options, path.join('src', 'docs', 'docs.component.ts'));
}

/** Adds import and declaration to universal */
function addDeclarationsToKitchenSink(options: DtComponentOptions): Rule {
  return (host: Tree) => {
    const sourceFilePath = path.join('src', 'universal-app', 'kitchen-sink', 'kitchen-sink.ts');
    const sourceFile = getSourceFile(host, sourceFilePath);

    const importChange = addDynatraceSubPackageImport(sourceFilePath, sourceFile, options);
    const changes = [importChange];

    /**
     * add it to the imports declaration in the module
     * since we have 2 imports property assignments we need to find the one with Dt***Module entries
     * get the indentation and the end and add a new import
     */
    const assignments = findNodes(sourceFile, ts.SyntaxKind.PropertyAssignment);

    changes.push(addToNgModule(sourceFilePath, sourceFile, options.moduleName, 'imports'));
    return commitChanges(host, changes, sourceFilePath);
  };
}

/** Adds selector to html */
function addCompToKitchenSinkHtml(options: DtComponentOptions): Rule {
  return (tree: Tree) => {
    const filePath = path.join('src', 'universal-app', 'kitchen-sink', 'kitchen-sink.html');
    const content = tree.read(filePath);
    if (!content) {
      return;
    }
    // Prevent from adding the same component again.
    if (content.indexOf(options.selector) === -1) {
      tree.overwrite(filePath, `${content}\n<${options.selector}></${options.selector}>`);
    }
    return tree;
  };
}

function addComponentToUiTestModule(options: DtComponentOptions): Rule {
  return (host: Tree) => {
    const sourceFilePath = path.join('src', 'ui-test-app', 'ui-test-app-module.ts');
    const sourceFile = getSourceFile(host, sourceFilePath);

    const changes = [];
    /** @dynatrace/angular-component import */
    changes.push(addDynatraceSubPackageImport(sourceFilePath, sourceFile, options));

    /**
     * relative <name>UI import
     */
    const uiImportName = `${strings.classify(options.name)}UI`;
    const uiImportLocation = `'./${strings.dasherize(options.name)}/${strings.dasherize(options.name)}-ui';`;
    changes.push(addImport(sourceFilePath, sourceFile, uiImportName, uiImportLocation));

    /**
     * add to exports of DynatraceAngularCompModule
     */
    changes.push(addToNgModule(sourceFilePath, sourceFile, options.moduleName, 'exports'));

    /**
     * Add to declarations of UiTestAppModule
     */
    changes.push(addToNgModule(sourceFilePath, sourceFile, uiImportName, 'declarations', /\w*?UI/));
    return commitChanges(host, changes, sourceFilePath);
  };
}

/**
 * Adds a new route inside the ui-test routes
 */
function addRouteInUITestApp(options: DtComponentOptions): Rule {
  return (host: Tree) => {
    const modulePath = path.join('src', 'ui-test-app', 'ui-test-app', 'routes.ts');
    const sourceFile = getSourceFile(host, modulePath);

    const importName = `${strings.classify(options.name)}UI`;
    const importLocation = `'../${strings.dasherize(options.name)}/${strings.dasherize(options.name)}-ui';`;
    const importChange = addImport(modulePath, sourceFile, importName, importLocation);

    /**
     * find last route and add new route
     */
    const routesDeclaration = findNodes(sourceFile, ts.SyntaxKind.VariableDeclaration)
    .find((node: ts.VariableDeclaration) => node.name.getText() === 'UI_TEST_APP_ROUTES') as ts.VariableDeclaration;
    const routes = (routesDeclaration.initializer as ts.ArrayLiteralExpression).elements;
    const end = (routes[routes.length - 1] as ts.Expression).getStart();
    const indentation = getIndentation(routes);
    const toInsert = `{ path: '${strings.dasherize(options.name)}', component: ${importName} },${indentation}`;
    const routesChange = new InsertChange(modulePath, end, toInsert);

    return commitChanges(host, [importChange, routesChange], modulePath);
  };
}

/**
 * Adds a new navitem inside the ui-test navitems
 */
function addNavitemInUITestApp(options: DtComponentOptions): Rule {
  return (host: Tree) => addNavItem(host, options, path.join('src', 'ui-test-app', 'ui-test-app', 'ui-test-app.ts'));
}

/**
 * Adds mappings to the system config in the demo-app
 */
function addMappingToSystemConfig(options: DtComponentOptions): Rule {
  return (host: Tree) => {
    const modulePath = path.join('src', 'ui-test-app', 'system-config.ts');
    const systemConfig = getSourceFile(host, modulePath);
    /**
     * find last angular-components property declaration
     */
    const map = findNodes(systemConfig, ts.SyntaxKind.PropertyAssignment)
      .find((node: ts.PropertyAssignment) => node.name.getText() === 'map') as ts.PropertyAssignment;
    const initializer = map.initializer as ts.ObjectLiteralExpression;
    const end = initializer.properties.end;
    const indentation = getIndentation(initializer.properties);
    const toInsert = `${indentation}'@dynatrace/angular-components/${options.name}':
      'dist/lib/bundles/dynatrace-angular-components-${options.name}.umd.js',`;
    const mapChange = new InsertChange(modulePath, end, toInsert);

    const changes = [mapChange];
    return commitChanges(host, changes, modulePath);
  };
}

export default function(options: DtComponentOptions): Rule {
  options.moduleName = `Dt${strings.classify(options.name)}Module`;
  options.selector = `dt-${strings.dasherize(options.name)}`;
  options.docsComponent = `Docs${strings.classify(options.name)}Component`;
  const templateSource = apply(url('./files'), [
      options.uitest ? noop() : filter((p) => !p.startsWith('/ui-test-app')),
      filter((p) => !p.startsWith('/ui-tests')),
      template({
        ...strings,
        ...options,
      }),
      move('src'),
    ]);
  const uitestsTemplates = apply(url('./files'), [
    filter((p) => p.startsWith('/ui-tests')),
    template({
      ...strings,
      ...options,
    }),
    move('.'),
  ]);

  return chain([
    mergeWith(templateSource),
    addExportToRootIndex(options),
    addDeclarationsToDocsModule(options),
    addRouteInDocs(options),
    addNavitemInDocs(options),
    addMappingToSystemConfig(options),
    options.universal ? chain([addDeclarationsToKitchenSink(options), addCompToKitchenSinkHtml(options)]) : noop(),
    options.uitest ? chain([
      mergeWith(uitestsTemplates),
      addRouteInUITestApp(options),
      addNavitemInUITestApp(options),
      addComponentToUiTestModule(options),
    ]) : noop(),
  ]);
}
