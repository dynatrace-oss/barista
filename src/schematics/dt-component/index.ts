import { strings } from '@angular-devkit/core';
import {
  apply,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  Rule,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import * as path from 'path';
import * as ts from 'typescript';
import {
  addDeclarationsToDevAppModule,
  addDynatraceAngularComponentsBaristaExampleModule,
  addDynatraceSubPackageImport,
  addImport,
  addNavitemToDevApp,
  addToNgModule,
  findNodes,
  getIndentation,
  getSourceFile,
  getSourceNodes,
} from '../utils/ast-utils';
import { commitChanges, InsertChange } from '../utils/change';
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
    rootPublicApiNodes.forEach(node => {
      if (node.kind === ts.SyntaxKind.ExportDeclaration) {
        lastExportPos = node.getEnd() + 1;
      }
    });
    const toInsert = `export * from '@dynatrace/angular-components/${options.name}';\n`;
    const changes = [new InsertChange(modulePath, lastExportPos, toInsert)];
    return commitChanges(host, changes, modulePath);
  };
}

/** Adds import and declaration to universal */
function addDeclarationsToKitchenSink(options: DtComponentOptions): Rule {
  return (host: Tree) => {
    const sourceFilePath = path.join(
      'src',
      'universal-app',
      'kitchen-sink',
      'kitchen-sink.ts',
    );
    const sourceFile = getSourceFile(host, sourceFilePath);

    const importChange = addDynatraceSubPackageImport(
      sourceFilePath,
      sourceFile,
      options,
    );
    const changes = [importChange];

    changes.push(
      addToNgModule(sourceFilePath, sourceFile, options.moduleName, 'imports'),
    );
    return commitChanges(host, changes, sourceFilePath);
  };
}

/** Adds selector to html */
function addCompToKitchenSinkHtml(options: DtComponentOptions): Rule {
  return (tree: Tree) => {
    const filePath = path.join(
      'src',
      'universal-app',
      'kitchen-sink',
      'kitchen-sink.html',
    );
    const content = tree.read(filePath);
    if (!content) {
      return;
    }
    // Prevent from adding the same component again.
    if (content.indexOf(options.selector) === -1) {
      tree.overwrite(
        filePath,
        `${content}\n<${options.selector}></${options.selector}>`,
      );
    }
    return tree;
  };
}

function addComponentToUiTestModule(options: DtComponentOptions): Rule {
  return (host: Tree) => {
    const sourceFilePath = path.join(
      'src',
      'ui-test-app',
      'ui-test-app-module.ts',
    );
    const sourceFile = getSourceFile(host, sourceFilePath);

    const changes: InsertChange[] = [];
    /** @dynatrace/angular-component import */
    changes.push(
      addDynatraceSubPackageImport(sourceFilePath, sourceFile, options),
    );

    /**
     * relative <name>UI import
     */
    const uiImportName = `${strings.classify(options.name)}UI`;
    const uiImportLocation = `'./${strings.dasherize(
      options.name,
    )}/${strings.dasherize(options.name)}-ui';`;
    changes.push(
      addImport(sourceFilePath, sourceFile, uiImportName, uiImportLocation),
    );

    /**
     * add to exports of DynatraceAngularCompModule
     */
    changes.push(
      addToNgModule(sourceFilePath, sourceFile, options.moduleName, 'exports'),
    );

    /**
     * Add to declarations of UiTestAppModule
     */
    changes.push(
      addToNgModule(
        sourceFilePath,
        sourceFile,
        uiImportName,
        'declarations',
        /\w*?UI/,
      ),
    );
    return commitChanges(host, changes, sourceFilePath);
  };
}

/**
 * Adds a new route inside the ui-test routes
 */
function addRouteInUITestApp(options: DtComponentOptions): Rule {
  return (host: Tree) => {
    const modulePath = path.join(
      'src',
      'ui-test-app',
      'ui-test-app',
      'routes.ts',
    );
    const sourceFile = getSourceFile(host, modulePath);

    const importName = `${strings.classify(options.name)}UI`;
    const importLocation = `'../${strings.dasherize(
      options.name,
    )}/${strings.dasherize(options.name)}-ui';`;
    const importChange = addImport(
      modulePath,
      sourceFile,
      importName,
      importLocation,
    );

    /**
     * find last route and add new route
     */
    const routesDeclaration = findNodes(
      sourceFile,
      ts.SyntaxKind.VariableDeclaration,
    ).find(
      (node: ts.VariableDeclaration) =>
        node.name.getText() === 'UI_TEST_APP_ROUTES',
    ) as ts.VariableDeclaration;
    const routes = (routesDeclaration.initializer as ts.ArrayLiteralExpression)
      .elements;
    const end = routes[routes.length - 1].getStart();
    const indentation = getIndentation(routes);
    const toInsert = `{ path: '${strings.dasherize(
      options.name,
    )}', component: ${importName} },${indentation}`;
    const routesChange = new InsertChange(modulePath, end, toInsert);

    return commitChanges(host, [importChange, routesChange], modulePath);
  };
}

/**
 * Adds a new navitem inside the ui-test navitems
 */
function addNavitemInUITestApp(options: DtComponentOptions): Rule {
  return (host: Tree) =>
    addNavItem(
      host,
      options,
      path.join('src', 'ui-test-app', 'ui-test-app', 'ui-test-app.ts'),
    );
}

/**
 * Adds a new route inside the ui-test routes
 */
function addRouteToDevApp(options: DtComponentOptions): Rule {
  return (host: Tree) => {
    const modulePath = path.join('src', 'dev-app', 'devapp-routing.module.ts');
    const sourceFile = getSourceFile(host, modulePath);
    const dasherizedName = strings.dasherize(options.name);
    const importName = `${strings.classify(options.name)}Demo`;
    const importLocation = `'./${dasherizedName}/${dasherizedName}-demo.component';`;

    const importChange = addImport(
      modulePath,
      sourceFile,
      importName,
      importLocation,
    );

    /**
     * find last route and add new route
     */
    const routesDeclaration = findNodes(
      sourceFile,
      ts.SyntaxKind.VariableDeclaration,
    ).find(
      (node: ts.VariableDeclaration) => node.name.getText() === 'routes',
    ) as ts.VariableDeclaration;
    const routes = (routesDeclaration.initializer as ts.ArrayLiteralExpression)
      .elements;
    const end = routes[routes.length - 1].getStart();
    const indentation = getIndentation(routes);
    const toInsert = `{ path: '${strings.dasherize(
      options.name,
    )}', component: ${importName} },${indentation}`;
    const routesChange = new InsertChange(modulePath, end, toInsert);

    return commitChanges(host, [importChange, routesChange], modulePath);
  };
}

/**
 * Adds the newly created component module to the imported modules in the dev-app
 * dt.module.ts
 */
function addReferenceToDevAppDtComponentsModule(
  options: DtComponentOptions,
): Rule {
  return (host: Tree) => {
    const sourceFilePath = path.join(
      'src',
      'dev-app',
      'dt-components.module.ts',
    );
    const sourceFile = getSourceFile(host, sourceFilePath);

    const changes: InsertChange[] = [];
    const importName = options.moduleName;

    changes.push(
      addDynatraceSubPackageImport(sourceFilePath, sourceFile, options),
    );
    changes.push(
      addToNgModule(sourceFilePath, sourceFile, importName, 'exports'),
    );
    return commitChanges(host, changes, sourceFilePath);
  };
}

/**
 * Adds the newly created component module to the imported modules in the barista examples
 * dt.module.ts
 */
function addReferenceToBaristaExamplesDtModules(
  options: DtComponentOptions,
): Rule {
  return (host: Tree) => {
    const sourceFilePath = path.join('src', 'barista-examples', 'dt.module.ts');
    const sourceFile = getSourceFile(host, sourceFilePath);

    const changes: InsertChange[] = [];
    const importName = options.moduleName;

    changes.push(
      addDynatraceSubPackageImport(sourceFilePath, sourceFile, options),
    );
    changes.push(
      addDynatraceAngularComponentsBaristaExampleModule(
        sourceFile,
        sourceFilePath,
        importName,
      ),
    );
    return commitChanges(host, changes, sourceFilePath);
  };
}

// tslint:disable-next-line: no-default-export
export default function(options: DtComponentOptions): Rule {
  options.moduleName = `Dt${strings.classify(options.name)}Module`;
  options.selector = `dt-${strings.dasherize(options.name)}`;
  options.docsComponent = `Docs${strings.classify(options.name)}Component`;
  const templateSource = apply(url('./files'), [
    options.uitest ? noop() : filter(p => !p.startsWith('/ui-test-app')),
    filter(p => !p.startsWith('/ui-tests')),
    template({
      ...strings,
      ...options,
    }),
    move('src'),
  ]);
  const uitestsTemplates = apply(url('./files'), [
    filter(p => p.startsWith('/ui-tests')),
    template({
      ...strings,
      ...options,
    }),
    move('.'),
  ]);

  return chain([
    mergeWith(templateSource),
    addExportToRootIndex(options),
    addDeclarationsToDevAppModule(options.name),
    addNavitemToDevApp(options.name),
    addRouteToDevApp(options),
    addReferenceToDevAppDtComponentsModule(options),
    addReferenceToBaristaExamplesDtModules(options),
    options.universal
      ? chain([
          addDeclarationsToKitchenSink(options),
          addCompToKitchenSinkHtml(options),
        ])
      : noop(),
    options.uitest
      ? chain([
          mergeWith(uitestsTemplates),
          addRouteInUITestApp(options),
          addNavitemInUITestApp(options),
          addComponentToUiTestModule(options),
        ])
      : noop(),
  ]);
}
