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
import {
  apply,
  chain,
  mergeWith,
  Rule,
  template,
  move,
  Tree,
  url,
  noop,
} from '@angular-devkit/schematics';
import { formatFiles } from '@nrwl/workspace';
import { DtComponentExampleOptions } from './schema';
import { normalize } from '@angular-devkit/core';
import { LICENSE_HEADER } from '../../utils/common-utils';
import { join } from 'path';
import { getSourceFile, findNodes } from '../utils/ast-utils';
import * as ts from 'typescript';
import { commitChanges, InsertChange } from '../utils/change';

interface DtExampleExtendedOptions {
  componentSelector: string;
  examplesModule: string;
  exampleRoute: string;
  selector: string;
  componentModule: {
    name: string;
    package: string;
  };
  exampleComponent: {
    component: string;
    module: string;
    modulesConstant: string;
    template: string;
  };
  name: string;
  component: string;
  dashName: string;
}

const EXAMPLES_SOURCE_PATH = 'libs/examples/src/';

/**
 * Function to generate util options for the component level generation.
 * @param options
 */
function generateComponentOptions(
  options: DtComponentExampleOptions,
): { name: string; package: string } {
  return {
    name: `Dt${strings.classify(options.component)}Module`,
    package: `@dynatrace/barista-components/${strings.dasherize(
      options.component,
    )}`,
  };
}

/**
 * Function to generate util options to be used during example generation.
 * @param options
 */
function generateExampleComponentOptions(
  options: DtComponentExampleOptions,
): {
  component: string;
  module: string;
  modulesConstant: string;
  template: string;
} {
  const dashName = strings.dasherize(options.component);
  return {
    component: `DtExample${strings.classify(options.name)}${strings.classify(
      options.component,
    )}`,
    module: `DtExample${strings.classify(options.name)}Module`,
    modulesConstant: `DT_${strings
      .underscore(options.component)
      .toUpperCase()}_EXAMPLES`,
    template: `${dashName}-${strings.dasherize(options.name)}-example.html`,
  };
}

/**
 * Generate the index file for the examples.
 * @param options
 */
function generateBarrelFileContent(options: DtExampleExtendedOptions): string {
  return `${LICENSE_HEADER}

  export * from './${options.dashName}-examples.module';
  export * from './${options.exampleRoute}';
  `;
}

/**
 * Generate the module file for the examples.
 * @param options
 */
function generateModuleFileContent(options: DtExampleExtendedOptions): string {
  return `${LICENSE_HEADER}
  import { NgModule } from '@angular/core';
  import { ${options.componentModule.name} } from '${options.componentModule.package}';
  import { ${options.exampleComponent.component} } from './${options.exampleRoute}';

  export const ${options.exampleComponent.modulesConstant} = [
    ${options.exampleComponent.component},
  ];

  @NgModule({
    imports: [${options.componentModule.name}],
    declarations: [...${options.exampleComponent.modulesConstant}],
    entryComponents: [...${options.exampleComponent.modulesConstant}],
  })
  export class ${options.examplesModule} {}`;
}

/**
 * This function adds import statement based o the parameters.
 * @param sourceFile The file to add the import into.
 * @param name Name of the needed import.
 * @param importPath The path of the import.
 * @param modulePath The path of module file to add the import into.
 */
function addImport(
  sourceFile: ts.SourceFile,
  name: string,
  importPath: string,
  modulePath: string,
): InsertChange {
  const lastImport = findNodes(
    sourceFile,
    ts.SyntaxKind.ImportDeclaration,
  ).pop() as ts.ImportDeclaration;
  // +1 because of new line
  const end = lastImport.end + 1;
  const toInsertImport = `import { ${name} } from './${importPath}';`;
  return new InsertChange(modulePath, end, toInsertImport);
}

/**
 * Add export statement to barrel files.
 * @param sourceFile The source of the file.
 * @param exportPath The path that we need to export.
 * @param modulePath The path of the file.
 */
function addExport(
  sourceFile: ts.SourceFile,
  exportPath: string,
  modulePath: string,
): InsertChange {
  const lastExport = findNodes(
    sourceFile,
    ts.SyntaxKind.ExportDeclaration,
  ).pop() as ts.ExportDeclaration;
  const end = lastExport.end + 1;
  const toInsertExport = `export * from './${exportPath}';`;
  return new InsertChange(modulePath, end, toInsertExport);
}

/**
 * Function to update the module files.
 * @param options
 */
function updateModules(options: DtExampleExtendedOptions): Rule {
  return (host: Tree) => {
    // add import
    const modulePath = join(
      'libs',
      'examples',
      'src',
      options.dashName,
      `${options.dashName}-examples.module.ts`,
    );
    const sourceFile = getSourceFile(host, modulePath);

    const importChange = addImport(
      sourceFile,
      options.exampleComponent.component,
      options.exampleRoute,
      modulePath,
    );

    // find last module in the array, and add new module
    const modulesDeclaration = findNodes(
      sourceFile,
      ts.SyntaxKind.VariableDeclaration,
    ).find(
      (node: ts.VariableDeclaration) =>
        node.name.getText() === options.exampleComponent.modulesConstant,
    ) as ts.VariableDeclaration;
    const modulesElements = (modulesDeclaration.initializer as ts.ArrayLiteralExpression)
      .elements;
    const lastElement = modulesElements[modulesElements.length - 1];
    const end = modulesElements.hasTrailingComma
      ? lastElement.getEnd() + 1
      : lastElement.getEnd();
    const routesChange = new InsertChange(
      modulePath,
      end,
      `${modulesElements.hasTrailingComma ? ' ' : ', '}${
        options.exampleComponent.component
      }`,
    );

    return commitChanges(host, [importChange, routesChange], modulePath);
  };
}

/**
 * Function to update the index file.
 * @param options
 */
function updateIndex(options: DtExampleExtendedOptions): Rule {
  return (host: Tree) => {
    // add export to index.ts
    const indexPath = join(
      'libs',
      'examples',
      'src',
      options.dashName,
      'index.ts',
    );
    const sourceIndexFile = getSourceFile(host, indexPath);
    const exportChange = addExport(
      sourceIndexFile,
      options.exampleRoute,
      indexPath,
    );

    return commitChanges(host, exportChange, indexPath);
  };
}

/**
 * The main function of the example schematics.
 * @param options
 */
export default function (options: DtComponentExampleOptions): Rule {
  return async (tree: Tree) => {
    const dashName = strings.dasherize(options.component);
    const exampleId = `${dashName}-${strings.dasherize(options.name)}`;
    const extendedOptions: DtExampleExtendedOptions = {
      ...options,
      componentSelector: `dt-${dashName}`,
      selector: `dt-example-${strings.dasherize(options.name)}-${dashName}`,
      componentModule: generateComponentOptions(options),
      exampleComponent: generateExampleComponentOptions(options),
      examplesModule: `DtExamples${strings.classify(options.component)}Module`,
      exampleRoute: `${exampleId}-example/${exampleId}-example`,
      dashName: dashName,
    };

    // Generating files from file templates, and moving them to their path.
    const templateSource = apply(url('./files'), [
      template({
        ...strings,
        ...extendedOptions,
      }),
      move(
        normalize(
          `${EXAMPLES_SOURCE_PATH}${dashName}/${dashName}-${strings.dasherize(
            options.name,
          )}-example`,
        ),
      ),
    ]);

    const indexPath = normalize(`${EXAMPLES_SOURCE_PATH}${dashName}/index.ts`);

    const isNewComponent = !tree.exists(indexPath);

    // If the example is for a new component, so there are no other examples for
    // for this component yet, we have to generate the index and module files.
    if (isNewComponent) {
      tree.create(indexPath, generateBarrelFileContent(extendedOptions));

      const modulePath = normalize(
        `${EXAMPLES_SOURCE_PATH}${dashName}/${dashName}-examples.module.ts`,
      );
      tree.create(modulePath, generateModuleFileContent(extendedOptions));
    }

    return chain([
      mergeWith(templateSource),
      isNewComponent ? noop() : updateModules(extendedOptions),
      isNewComponent ? noop() : updateIndex(extendedOptions),
      formatFiles(),
    ]);
  };
}
