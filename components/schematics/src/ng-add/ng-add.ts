/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

// /**
//  * @license
//  * Copyright 2019 Dynatrace LLC
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  * http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

// import {
//   Rule,
//   SchematicContext,
//   Tree,
//   chain,
// } from '@angular-devkit/schematics';
// import { Schema } from './schema';
// import { readFileSync } from 'fs';
// import {
//   getImportModuleSpecifier,
//   updateNgModuleDecoratorProperties,
//   NgModuleProperties,
// } from './utils-ast';
// import {
//   renameExistingImports,
//   createStringLiteral,
//   insertNodeToFileInTree,
//   rewriteAngularJsonImports,
// } from './rules';
// import {
//   getFilesToCheck,
//   readFileFromTree,
//   readJsonAsObjectFromTree,
// } from '../utils';
// import * as ts from 'typescript';
// import { addDependencies } from './rules/add-dependencies';
// import { NodeDependencyType } from './rules/add-package-json-dependency';
// import { removeDependencies } from './rules/remove-dependencies';

// // Call visitNode to start the search into the sourcefile
// // If is decorator is true then look for allChildren
// // When the imports have been found update them to include browseranimationsmodule

// /** Check workspace for files */
// function checkWorkspace(): Rule {
//   return (tree: Tree, context: SchematicContext) => {
//     try {
//       if (!tree.exists('package.json')) {
//         throw new Error('Cannot find package.json');
//       }

//       if (!tree.exists('angular.json')) {
//         throw new Error('Cannot find angular.json');
//       }
//     } catch (error) {
//       context.logger.error(error.message);
//       throw error;
//     }
//   };
// }

// /** Check for angular/barista-components in package.json */
// function refactorPackageJsonImports(): Rule {
//   return (tree: Tree, context: SchematicContext) => {
//     const rules: Rule[] = [];
//     const packageJSON = readFileFromTree(tree, '/package.json');

//     if (packageJSON.includes('@dynatrace/angular-components')) {
//       rules.push(
//         removeDependencies(['@dynatrace/angular-components'], '/package.json'),
//       );
//     } else {
//       rules.push(
//         addDependencies(
//           [
//             {
//               name: '@dynatrace/barista-icons',
//               type: NodeDependencyType.Default,
//               version: '5.0.0',
//             },
//             {
//               name: 'd3-scale',
//               type: NodeDependencyType.Default,
//               version: '{{version}}',
//             },
//             {
//               name: 'd3-shape',
//               type: NodeDependencyType.Default,
//               version: '{{version}}',
//             },
//             {
//               name: 'd3-geo',
//               type: NodeDependencyType.Default,
//               version: '{{version}}',
//             },
//             {
//               name: 'highcharts',
//               type: NodeDependencyType.Default,
//               version: '{{version}}',
//             },
//           ],
//           '/package.json',
//         ),
//       );
//     }

//     rules.push(
//       addDependencies(
//         [
//           {
//             name: '@dynatrace/barista-components',
//             type: NodeDependencyType.Default,
//             version: '5.0.0',
//           },
//         ],
//         '/package.json',
//       ),
//     );

//     return chain(rules)(tree, context);
//   };
// }

// /** Check filesystem for imports of dynatrace/angular-components and rename then to barista-components */
// function refactorComponentImports(options: Schema): Rule {
//   return (tree: Tree, context: SchematicContext) => {
//     const rules: Rule[] = [];

//     // check if we have existing components library installed
//     if (
//       checkPackageJsonImports(
//         tree,
//         'package.json',
//         '@dynatrace/barista-components',
//       )
//     ) {
//       let files: string[] = [];
//       if (options.isTestEnv) {
//         files = ['apps/src/main.ts'];
//       } else {
//         files = getFilesToCheck('**/*.ts');
//       }

//       rules.push(renameExistingImports(files));
//     }
//     return chain(rules)(tree, context);
//   };
// }

// /** Checks package.json files and adds Dynatrace peerDependencies */
// function installPeerDependencies(options: Schema): Rule {
//   return (tree: Tree, context: SchematicContext) => {
//     const rules: Rule[] = [];
//     let packages: string[] = [];

//     if (options.isTestEnv) {
//       packages = ['components/src/peerPackage.json'];
//     } else {
//       packages = getFilesToCheck('**/package.json');
//     }

//     for (const pkg of packages) {
//       const packageJSON = readJsonAsObjectFromTree(tree, pkg);
//       // install peerDependencies
//       if (packageJSON.peerDependencies) {
//         packageJSON.peerDependencies['@dynatrace/barista-icons'] =
//           '>= 3.0.0 < 4';
//         packageJSON.peerDependencies['@dynatrace/barista-fonts'] =
//           '>= 1.0.0 < 2';
//         packageJSON.peerDependencies['@types/highcharts'] = '^5.0.23';
//         packageJSON.peerDependencies['d3-scale'] = '^3.0.0';
//         packageJSON.peerDependencies['d3-shape'] = '^1.3.5';
//         packageJSON.peerDependencies['highcharts'] = '^6.0.7';
//         tree.overwrite(pkg, JSON.stringify(packageJSON, null, 2));
//       }
//     }
//     return chain(rules)(tree, context);
//   };
// }

// /** Installs Angular Animations Module and adds import to app.module.ts */
// function installAnimationsModule(options: Schema): Rule {
//   return (tree: Tree, _: SchematicContext) => {
//     if (!options.animations) {
//       return;
//     }

//     const packageJson = readJsonAsObjectFromTree(tree, '/package.json');

//     // If not already installed, add Angular Animations to package.json
//     if (
//       !Object.keys(packageJson.dependencies).includes('@angular/animations')
//     ) {
//       packageJson.dependencies['@angular/animations'] = '9.0.0';
//     }

//     let files;

//     if (options.isTestEnv) {
//       files = ['app.module.ts'];
//     } else {
//       files = getFilesToCheck('**/app.module.ts');
//     }

//     for (const file of files) {
//       // Get sourcefile from app.module in tree
//       const sourceText = readFileFromTree(tree, file);
//       const appModuleAst = ts.createSourceFile(
//         file,
//         sourceText,
//         ts.ScriptTarget.Latest,
//         true,
//       );
//       let hasAnimationImport = false;

//       // We loop over sourcefile statements
//       for (let i = appModuleAst.statements.length - 1; i >= 0; i--) {
//         const statement = appModuleAst.statements[i];
//         // Check if statement is an Import
//         if (ts.isImportDeclaration(statement)) {
//           const moduleSpecifier = getImportModuleSpecifier(statement);
//           // Check whether Angular Animations is installed
//           if (
//             moduleSpecifier &&
//             moduleSpecifier.includes('@angular/platform-browser/animations')
//           ) {
//             hasAnimationImport = true;

//             break;
//           }
//         }
//       }
//       // Adds Angular Animation to package.json if not existing
//       if (!hasAnimationImport) {
//         const node = createStringLiteral(
//           `import { BrowserAnimationsModule } from \'@angular/platform-browser/animations\';`,
//           false,
//         );
//         insertNodeToFileInTree(tree, file, appModuleAst, node);
//       }

//       let sourceFile = ts.createSourceFile(
//         file,
//         readFileFromTree(tree, file),
//         ts.ScriptTarget.Latest,
//         true,
//       );
//       // Update sourcefile (app.module.ts) to include BrowserAnimationsModule
//       const newSourceFile: ts.SourceFile = updateNgModuleDecoratorProperties(
//         sourceFile,
//         NgModuleProperties.Imports,
//         ts.createIdentifier('BrowserAnimationsModule,'),
//       );
//       const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

//       const printedNode = printer.printNode(
//         ts.EmitHint.Unspecified,
//         newSourceFile,
//         ts.createSourceFile('', '', ts.ScriptTarget.Latest, true),
//       );
//       // Update app.module
//       tree.overwrite(file, printedNode);
//     }
//   };
// }

// /** Adds import to Dynatrace Styles */
// function installStyles(options: Schema): Rule {
//   return (tree: Tree, _: SchematicContext) => {
//     if (!options.stylesPack) {
//       return;
//     }
//     let mainStyle = '';
//     let sourceFile: ts.SourceFile;
//     let styleImport: ts.StringLiteral;
//     let fileName: string | undefined = undefined;
//     let files: string[] = [];

//     if (options.isTestEnv) {
//       files = ['index.css'];
//     } else {
//       files = getFilesToCheck('**/*.scss');
//       files.concat(getFilesToCheck('**/*.css'));
//     }

//     for (const file of files) {
//       if (
//         file.includes('index.css') ||
//         file.includes('index.scss') ||
//         file.includes('styles.css') ||
//         file.includes('styles.scss')
//       ) {
//         fileName = file;

//         if (options.stylesPack) {
//           styleImport = ts.createStringLiteral(
//             "@import '~@dynatrace/angular-components/style/index';",
//           );
//         } else {
//           styleImport = ts.createStringLiteral(
//             "@import '~@dynatrace/angular-components/style/main';",
//           );
//         }

//         if (fileName) {
//           mainStyle = readFileFromTree(tree, fileName);
//           sourceFile = ts.createSourceFile(
//             fileName,
//             mainStyle,
//             ts.ScriptTarget.Latest,
//           );
//           insertNodeToFileInTree(tree, fileName, sourceFile, styleImport);
//         } else {
//           console.error('No styles has been found');
//         }
//       }
//     }
//   };
// }

// /** Refactors AngularJson paths to Dynatrace Fonts and Icons package */
// function refactorAngularJsonPaths(options: Schema): Rule {
//   return (tree: Tree, context: SchematicContext) => {
//     if (!options.angularPathRefactor) {
//       return;
//     }

//     const rules: Rule[] = [];
//     rules.push(rewriteAngularJsonImports('angular.json', true));

//     return chain(rules)(tree, context);
//   };
// }

// /**
//  * Retrieve all files which need to be checked for imports
//  * @param tree host tree
//  */
// function checkPackageJsonImports(
//   tree: Tree,
//   path: string,
//   searchString: string,
// ): boolean {
//   const packageJSON = readJsonAsObjectFromTree(tree, path);
//   if (packageJSON) {
//     if (Object.keys(packageJSON.dependencies).includes(searchString)) {
//       return true;
//     }
//   }
//   return false;
// }

// export function readJsonFile<T = any>(path: string): T {
//   return JSON.parse(readFileSync(path, 'utf-8'));
// }

// /** This chains an array of rules and executes them */
// export function add(options: any): Rule {
//   return (tree: Tree, context: SchematicContext) => {
//     const rule = chain([
//       checkWorkspace(),
//       refactorPackageJsonImports(),
//       refactorComponentImports(options),
//       installPeerDependencies(options),
//       installAnimationsModule(options),
//       installStyles(options),
//       refactorAngularJsonPaths(options),
//     ]);
//     return rule(tree, context);
//   };
// }
