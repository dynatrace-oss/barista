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
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { DtComponentOptions } from './schema';
import { getSourceFile, getSourceNodes, findNodes, getIndentation, addDynatraceAngularComponentsImport } from '../utils/ast-utils';
import * as path from 'path';
import * as ts from 'typescript';
import { InsertChange, commitChanges } from '../utils/change';

function filterTemplates(): Rule {
  return filter((path) => !path.match(/\.bak$/));
}

/**
 * Adds the export to the index in the lib root
 */
function addExportToRootIndex(options: DtComponentOptions): Rule {
  return (host: Tree) => {
    const modulePath = path.join('src', 'lib', 'public-api.ts');
    const rootPublicApi = getSourceFile(host, modulePath);
    const rootPublicApiNodes = getSourceNodes(rootPublicApi);
    let lastExportPos:number = 0;
    rootPublicApiNodes.forEach(node => {
      if (node.kind === ts.SyntaxKind.ExportDeclaration) {
        lastExportPos = node.getEnd() + 1;
      }
    });
    const toInsert = `export * from '@dynatrace/ngx-groundhog/${options.name}';\n`;
    const changes = [new InsertChange(modulePath, lastExportPos, toInsert)];
    return commitChanges(host, changes, modulePath);
  }
}

/**
 * Adds the declarations for the lib module inside the demo-groundhog-module
 * @param {GhComponentOptions} options 
 */
function addDeclarationsToDemoGroundhogModule(options: GhComponentOptions): Rule {
  return (host: Tree) => {
    const modulePath = path.join('src', 'demo-app', 'demo-groundhog-module.ts');
    const demoGroundhogModule = getSourceFile(host, modulePath);
    
    const importChange = addNgxGroundhogImport(demoGroundhogModule, modulePath, options.symbolName);
    /**
     * add it to the exports declaration in the module
     */
    const assignments = findNodes(demoGroundhogModule, ts.SyntaxKind.PropertyAssignment);
    const assignment = assignments[0] as ts.PropertyAssignment;
    const arrLiteral = assignment.initializer as ts.ArrayLiteralExpression;
    const exportsElements = arrLiteral.elements;
    const end = arrLiteral.elements.end;

    const indentation = getIndentation(exportsElements);
    const toInsert = `${indentation}${options.symbolName},`;
    const exportsChange = new InsertChange(modulePath, end, toInsert);

    const changes = [importChange, exportsChange];
    return commitChanges(host, changes, modulePath);
  }
}

/**
 * Adds a new route inside the docs routes
 */
// function addDocsDeclarationsToRoutes(options: GhComponentOptions): Rule {
//   return (host: Tree) => {
//     const modulePath = path.join('src', 'docs', 'demo-app', 'routes.ts');
//     const routes = getSourceFile(host, modulePath);

//     /**
//      * get all importnodes if there are any and insert a new one at the end
//      */
//     const importNodes = findNodes(routes, ts.SyntaxKind.ImportDeclaration);
//     let pos = 0;
//     if (importNodes.length > 0) {
//       pos = importNodes[importNodes.length-1].getEnd();
//     }

//     let toInsert = `\nimport { ${strings.classify(options.name)}Demo } from '../${options.name}/${strings.dasherize(options.name)}-demo';`;
//     const importChange = new InsertChange(modulePath, pos, toInsert);
//     /**
//      * add it the children route array
//      */
//     /**
//      * find first children property assignment
//      */
//     const childrenAssignment = findNodes(routes, ts.SyntaxKind.PropertyAssignment)
//     .find((node:ts.PropertyAssignment) => {
//       return node.name.getText() === 'children';
//     }) as ts.PropertyAssignment;
//     const childrenInitializerElements = (childrenAssignment.initializer as ts.ArrayLiteralExpression).elements;
//     const end = childrenInitializerElements.end;
//     const indentation = getIndentation(childrenInitializerElements);
//     toInsert = `${indentation}{path: '${options.name}', component: ${strings.classify(options.name)}Demo},`;
//     const routeChange = new InsertChange(modulePath, end, toInsert);

//     const changes = [importChange, routeChange];
//     return commitChanges(host, changes, modulePath);
//   }
// }

/**
 * Adds a new route for the demo app navItems
 */
// function addRouteToDemoApp(options: GhComponentOptions): Rule {
//   return (host: Tree) => {
//     const modulePath = path.join('src', 'demo-app', 'demo-app', 'demo-app.ts');
//     const demoApp = getSourceFile(host, modulePath);
//     /**
//      * find first navItems property assignment
//      */
//     const navItemsAssignment = findNodes(demoApp, ts.SyntaxKind.PropertyDeclaration)
//     .find((node:ts.PropertyDeclaration) => {
//       return node.name.getText() === 'navItems';
//     }) as ts.VariableDeclaration;
//     const navItemInitializerElements = (navItemsAssignment.initializer as ts.ArrayLiteralExpression).elements;
//     const end = navItemInitializerElements.end;
//     const indentation = getIndentation(navItemInitializerElements);
//     const toInsert = `${indentation}{name: '${strings.classify(options.name)}', route: '/${options.name}'},`;
//     const routeChange = new InsertChange(modulePath, end, toInsert);

//     const changes = [routeChange];
//     return commitChanges(host, changes, modulePath);
//   }
// }

/**
 * Adds the demo declarations to the demo-module.ts
 */
// function addDemoDeclarationsToDemoModule(options: GhComponentOptions): Rule {
//   return (host: Tree) => {
//     const modulePath = path.join('src', 'demo-app', 'demo-app', 'demo-module.ts');
//     const demoModule = getSourceFile(host, modulePath);
    
//     /**
//      * get all importnodes if there are any and insert a new one at the end
//      */
//     const importNodes = findNodes(demoModule, ts.SyntaxKind.ImportDeclaration);
//     let pos = 0;
//     if (importNodes.length > 0) {
//       pos = importNodes[importNodes.length - 1].getEnd();
//     }
//     let toInsert = `\nimport { ${strings.classify(options.name)}Demo } from '../${options.name}/${strings.dasherize(options.name)}-demo';`;
//     const importChange = new InsertChange(modulePath, pos, toInsert);
//     /**
//      * add it to the declarations in the module
//      */
//     const assignment = findNodes(demoModule, ts.SyntaxKind.PropertyAssignment)
//     .find((node:ts.PropertyAssignment) => {
//       return node.name.getText() === 'declarations';
//     }) as ts.PropertyAssignment;
//     const arrLiteral = assignment.initializer as ts.ArrayLiteralExpression;
//     const declarationsElements = arrLiteral.elements;
//     const end = arrLiteral.elements.end;

//     const indentation = getIndentation(declarationsElements);
//     toInsert = `${indentation}${strings.classify(options.name)}Demo,`;
//     const declarationsChange = new InsertChange(modulePath, end, toInsert);

//     const changes = [importChange, declarationsChange];
//     return commitChanges(host, changes, modulePath);
//   }
// }

/**
 * Adds mappings to the system config in the demo-app
 */
// function addMappingToSystemConfig(options: GhComponentOptions): Rule {
//   return (host: Tree) => {
//     const modulePath = path.join('src', 'demo-app', 'system-config.ts');
//     const systemConfig = getSourceFile(host, modulePath);
//     /**
//      * find last ngx-groundhog property declaration
//      */
//     const map = findNodes(systemConfig, ts.SyntaxKind.PropertyAssignment)
//     .find((node:ts.PropertyAssignment) => {
//       return node.name.getText() === 'map';
//     }) as ts.PropertyAssignment;
//     const initializer = map.initializer as ts.ObjectLiteralExpression;
//     const end = initializer.properties.end;
//     const indentation = getIndentation(initializer.properties);
//     const toInsert = `${indentation}'@dynatrace/ngx-groundhog/${options.name}': 'dist/packages/ngx-groundhog/${options.name}/index.js',`;
//     const mapChange = new InsertChange(modulePath, end, toInsert);

//     const changes = [mapChange];
//     return commitChanges(host, changes, modulePath);
//   }
// }

export function(options: DtComponentOptions): Rule {
  options.symbolName = `Dt${strings.classify(options.name)}Module`;

  const templateSource = apply(url('./files'), [
      filterTemplates(),
      template({
        ...strings,
        ...options,
      }),
      move(options.sourceDir),
    ]);

  return chain([
      branchAndMerge(chain([
        mergeWith(templateSource),
        addExportToRootIndex(options),
        // addDeclarationsToDemoGroundhogModule(options),
        // addDemoDeclarationsToRoutes(options),
        // addRouteToDemoApp(options),
        // addDemoDeclarationsToDemoModule(options),
        // addMappingToSystemConfig(options),
      ])),
    ]);
}
